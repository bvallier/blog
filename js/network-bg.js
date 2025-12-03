/**
 * Interactive Network Background
 * A flowing circuit/neural-network style animation with post previews
 */

(function() {
  'use strict';

  const canvas = document.getElementById('network-bg');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let nodes = [];
  let postNodes = [];
  let mouse = { x: null, y: null, radius: 150 };
  let hoveredPostNode = null;
  let tooltip = null;
  
  // Configuration - subtle, barely moving
  const config = {
    nodeCount: 60,
    nodeMinRadius: 1.5,
    nodeMaxRadius: 2.5,
    postNodeRadius: 6,
    connectionDistance: 200,
    mouseInfluence: 180,
    baseSpeed: 0.05,        // Very slow drift
    pulseSpeed: 0.008,      // Very subtle pulse
    pulseAmount: 0.2,       // Minimal size change
    colors: {
      node: 'rgba(191, 91, 60, 0.5)',
      nodeGlow: 'rgba(191, 91, 60, 0.15)',
      line: 'rgba(191, 91, 60, 0.25)',           // Bolder lines
      lineActive: 'rgba(217, 116, 85, 0.4)',     // Bolder active
      postNode: 'rgba(191, 91, 60, 0.85)',
      postNodeGlow: 'rgba(191, 91, 60, 0.3)',
      postNodeHover: 'rgba(217, 116, 85, 1)',
      pulse: 'rgba(232, 164, 140, 0.6)'
    }
  };

  // Pulse particles
  let pulses = [];

  // Get posts data from the page (injected by Jekyll)
  const postsData = window.blogPosts || [];

  class Node {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.baseRadius = config.nodeMinRadius + Math.random() * (config.nodeMaxRadius - config.nodeMinRadius);
      this.radius = this.baseRadius;
      this.vx = (Math.random() - 0.5) * config.baseSpeed;
      this.vy = (Math.random() - 0.5) * config.baseSpeed;
      this.pulseOffset = Math.random() * Math.PI * 2;
    }

    update(time) {
      // Very gentle floating motion
      this.x += this.vx;
      this.y += this.vy;

      // Very subtle pulsing
      this.radius = this.baseRadius + Math.sin(time * config.pulseSpeed + this.pulseOffset) * config.pulseAmount;

      // Mouse interaction - very gentle push (only regular nodes)
      if (mouse.x !== null && !hoveredPostNode) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < config.mouseInfluence && dist > 0) {
          const force = (config.mouseInfluence - dist) / config.mouseInfluence;
          const angle = Math.atan2(dy, dx);
          // Very subtle push - reduced from 0.3 to 0.15
          this.x += Math.cos(angle) * force * 0.15;
          this.y += Math.sin(angle) * force * 0.15;
        }
      }

      // Boundary wrapping
      if (this.x < -50) this.x = width + 50;
      if (this.x > width + 50) this.x = -50;
      if (this.y < -50) this.y = height + 50;
      if (this.y > height + 50) this.y = -50;
    }

    draw() {
      // Subtle glow
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = config.colors.nodeGlow;
      ctx.fill();

      // Core node
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = config.colors.node;
      ctx.fill();
    }
  }

  class PostNode {
    constructor(post, index, total) {
      // Position post nodes in the negative space - edges and corners
      // These are fixed positions that avoid the main content area
      const positions = [
        { x: 60, y: 80 },                           // Top left
        { x: width - 60, y: 80 },                   // Top right
        { x: 60, y: height * 0.4 },                 // Left middle-upper
        { x: width - 60, y: height * 0.35 },        // Right middle-upper
        { x: 60, y: height * 0.7 },                 // Left middle-lower
        { x: width - 60, y: height * 0.65 },        // Right middle-lower
        { x: 60, y: height - 80 },                  // Bottom left
        { x: width - 60, y: height - 80 },          // Bottom right
      ];
      
      const pos = positions[index % positions.length];
      this.baseX = pos.x;
      this.baseY = pos.y;
      this.x = this.baseX;
      this.y = this.baseY;
      
      this.radius = config.postNodeRadius;
      this.baseRadius = config.postNodeRadius;
      this.pulseOffset = Math.random() * Math.PI * 2;
      this.post = post;
      this.isHovered = false;
      this.hoverScale = 1;
      this.targetHoverScale = 1;
    }

    update(time) {
      // Post nodes stay fixed - no floating, they're stable click targets
      this.x = this.baseX;
      this.y = this.baseY;

      // Very subtle pulse only when not hovered
      if (!this.isHovered) {
        this.radius = this.baseRadius + Math.sin(time * config.pulseSpeed + this.pulseOffset) * 0.3;
      } else {
        this.radius = this.baseRadius;
      }

      // Smooth hover animation
      this.hoverScale += (this.targetHoverScale - this.hoverScale) * 0.15;
    }

    draw() {
      const scale = this.hoverScale;
      const radius = this.radius * scale;

      // Outer glow ring
      ctx.beginPath();
      ctx.arc(this.x, this.y, radius * 2.5, 0, Math.PI * 2);
      const glowColor = this.isHovered ? 'rgba(217, 116, 85, 0.25)' : config.colors.postNodeGlow;
      ctx.fillStyle = glowColor;
      ctx.fill();

      // Middle ring
      ctx.beginPath();
      ctx.arc(this.x, this.y, radius * 1.6, 0, Math.PI * 2);
      ctx.strokeStyle = this.isHovered ? 'rgba(217, 116, 85, 0.5)' : 'rgba(191, 91, 60, 0.3)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Core
      ctx.beginPath();
      ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = this.isHovered ? config.colors.postNodeHover : config.colors.postNode;
      ctx.fill();

      // Inner highlight
      ctx.beginPath();
      ctx.arc(this.x - radius * 0.3, this.y - radius * 0.3, radius * 0.3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.fill();
    }

    containsPoint(px, py) {
      const dx = px - this.x;
      const dy = py - this.y;
      // Large hit area for easy hovering
      return Math.sqrt(dx * dx + dy * dy) < this.radius * 4;
    }
    
    reposition(index, w, h) {
      // Reposition when window resizes
      const positions = [
        { x: 60, y: 80 },                    // Top left
        { x: w - 60, y: 80 },                // Top right
        { x: 60, y: h * 0.4 },               // Left middle-upper
        { x: w - 60, y: h * 0.35 },          // Right middle-upper
        { x: 60, y: h * 0.7 },               // Left middle-lower
        { x: w - 60, y: h * 0.65 },          // Right middle-lower
        { x: 60, y: h - 80 },                // Bottom left
        { x: w - 60, y: h - 80 },            // Bottom right
      ];
      const pos = positions[index % positions.length];
      this.baseX = pos.x;
      this.baseY = pos.y;
      this.x = this.baseX;
      this.y = this.baseY;
    }
  }

  class Pulse {
    constructor(startNode, endNode) {
      this.startNode = startNode;
      this.endNode = endNode;
      this.progress = 0;
      this.speed = 0.008 + Math.random() * 0.005;
      this.size = 2 + Math.random() * 1.5;
    }

    update() {
      this.progress += this.speed;
      return this.progress < 1;
    }

    draw() {
      const x = this.startNode.x + (this.endNode.x - this.startNode.x) * this.progress;
      const y = this.startNode.y + (this.endNode.y - this.startNode.y) * this.progress;
      const alpha = Math.sin(this.progress * Math.PI) * 0.6;
      
      ctx.beginPath();
      ctx.arc(x, y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(232, 164, 140, ${alpha})`;
      ctx.fill();
    }
  }

  let tooltipHovered = false;
  let currentTooltipPost = null;

  function createTooltip() {
    tooltip = document.createElement('div');
    tooltip.id = 'post-tooltip';
    tooltip.innerHTML = `
      <div class="tooltip-content">
        <div class="tooltip-title"></div>
        <div class="tooltip-summary"></div>
        <div class="tooltip-hint">Click to read →</div>
      </div>
    `;
    document.body.appendChild(tooltip);
    
    // Make tooltip interactive
    tooltip.addEventListener('mouseenter', () => {
      tooltipHovered = true;
    });
    
    tooltip.addEventListener('mouseleave', () => {
      tooltipHovered = false;
      // Small delay before hiding to allow moving back to node
      setTimeout(() => {
        if (!tooltipHovered && !hoveredPostNode) {
          hideTooltip();
          // Reset hover states
          for (const pn of postNodes) {
            pn.isHovered = false;
            pn.targetHoverScale = 1;
          }
        }
      }, 100);
    });
    
    // Click tooltip to navigate
    tooltip.addEventListener('click', () => {
      if (currentTooltipPost && currentTooltipPost.url) {
        window.location.href = currentTooltipPost.url;
      }
    });
  }

  function showTooltip(postNode) {
    if (!tooltip) return;
    
    const post = postNode.post;
    currentTooltipPost = post;
    tooltip.querySelector('.tooltip-title').textContent = post.title;
    tooltip.querySelector('.tooltip-summary').textContent = post.summary || '';
    
    // Position tooltip
    let x = postNode.x + 20;
    let y = postNode.y - 10;
    
    // Keep tooltip in viewport
    if (x + 280 > width) x = postNode.x - 290;
    if (y + 150 > height) y = height - 160;
    if (y < 10) y = 10;
    
    tooltip.style.left = x + 'px';
    tooltip.style.top = y + 'px';
    tooltip.classList.add('visible');
  }

  function hideTooltip() {
    if (tooltip) {
      tooltip.classList.remove('visible');
    }
  }

  function init() {
    resize();
    createTooltip();
    nodes = [];
    postNodes = [];
    
    // Create regular nodes
    for (let i = 0; i < config.nodeCount; i++) {
      nodes.push(new Node());
    }
    
    // Create post nodes (up to 6 random posts)
    if (postsData.length > 0) {
      const shuffled = [...postsData].sort(() => Math.random() - 0.5);
      const selectedPosts = shuffled.slice(0, Math.min(6, shuffled.length));
      
      selectedPosts.forEach((post, i) => {
        postNodes.push(new PostNode(post, i, selectedPosts.length));
      });
    }
    
    window.addEventListener('resize', resize);
    canvas.style.pointerEvents = 'auto';
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseout', onMouseOut);
    canvas.addEventListener('click', onClick);
    
    animate(0);
  }

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    
    // Reposition post nodes on resize
    postNodes.forEach((pn, i) => {
      pn.reposition(i, width, height);
    });
  }

  function onMouseMove(e) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    
    // Check for post node hover
    let foundHover = null;
    for (const pn of postNodes) {
      if (pn.containsPoint(mouse.x, mouse.y)) {
        foundHover = pn;
        break;
      }
    }
    
    // Update hover states
    for (const pn of postNodes) {
      const wasHovered = pn.isHovered;
      pn.isHovered = (pn === foundHover);
      pn.targetHoverScale = pn.isHovered ? 1.4 : 1;
      
      if (pn.isHovered && !wasHovered) {
        showTooltip(pn);
        canvas.style.cursor = 'pointer';
      }
    }
    
    if (!foundHover && hoveredPostNode && !tooltipHovered) {
      hideTooltip();
      canvas.style.cursor = 'default';
    }
    
    hoveredPostNode = foundHover;
  }

  function onMouseOut() {
    mouse.x = null;
    mouse.y = null;
    
    // Don't hide immediately - check if tooltip is hovered
    setTimeout(() => {
      if (!tooltipHovered) {
        for (const pn of postNodes) {
          pn.isHovered = false;
          pn.targetHoverScale = 1;
        }
        hoveredPostNode = null;
        hideTooltip();
        canvas.style.cursor = 'default';
      }
    }, 50);
  }

  function onClick(e) {
    if (hoveredPostNode && hoveredPostNode.post.url) {
      window.location.href = hoveredPostNode.post.url;
    }
  }

  function drawConnections(time) {
    const allNodes = [...nodes, ...postNodes];
    
    for (let i = 0; i < allNodes.length; i++) {
      for (let j = i + 1; j < allNodes.length; j++) {
        const dx = allNodes[i].x - allNodes[j].x;
        const dy = allNodes[i].y - allNodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < config.connectionDistance) {
          const opacity = (1 - dist / config.connectionDistance);
          
          // Check if this connects to a post node
          const isPostConnection = (allNodes[i] instanceof PostNode) || (allNodes[j] instanceof PostNode);
          
          // Check if near mouse
          let isNearMouse = false;
          if (mouse.x !== null) {
            const midX = (allNodes[i].x + allNodes[j].x) / 2;
            const midY = (allNodes[i].y + allNodes[j].y) / 2;
            const mouseDist = Math.sqrt((midX - mouse.x) ** 2 + (midY - mouse.y) ** 2);
            isNearMouse = mouseDist < config.mouseInfluence;
          }

          ctx.beginPath();
          ctx.moveTo(allNodes[i].x, allNodes[i].y);
          ctx.lineTo(allNodes[j].x, allNodes[j].y);
          
          if (isPostConnection) {
            ctx.strokeStyle = `rgba(191, 91, 60, ${opacity * 0.35})`;
            ctx.lineWidth = 1.8;
          } else if (isNearMouse) {
            ctx.strokeStyle = `rgba(217, 116, 85, ${opacity * 0.4})`;
            ctx.lineWidth = 1.5;
            
            // Spawn pulses on active connections
            if (Math.random() < 0.0005) {
              pulses.push(new Pulse(allNodes[i], allNodes[j]));
            }
          } else {
            ctx.strokeStyle = `rgba(191, 91, 60, ${opacity * 0.25})`;
            ctx.lineWidth = 1.2;
          }
          
          ctx.stroke();
        }
      }
    }
  }

  function animate(time) {
    ctx.clearRect(0, 0, width, height);

    // Draw connections (behind nodes)
    drawConnections(time);

    // Update and draw regular nodes
    for (const node of nodes) {
      node.update(time);
      node.draw();
    }

    // Update and draw post nodes
    for (const pn of postNodes) {
      pn.update(time);
      pn.draw();
    }

    // Update and draw pulses
    pulses = pulses.filter(pulse => {
      const alive = pulse.update();
      if (alive) pulse.draw();
      return alive;
    });

    // Spawn occasional pulses
    if (Math.random() < 0.008 && nodes.length > 1) {
      const allNodes = [...nodes, ...postNodes];
      const i = Math.floor(Math.random() * allNodes.length);
      let j = Math.floor(Math.random() * allNodes.length);
      while (j === i) j = Math.floor(Math.random() * allNodes.length);
      
      const dx = allNodes[i].x - allNodes[j].x;
      const dy = allNodes[i].y - allNodes[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < config.connectionDistance) {
        pulses.push(new Pulse(allNodes[i], allNodes[j]));
      }
    }

    requestAnimationFrame(animate);
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
