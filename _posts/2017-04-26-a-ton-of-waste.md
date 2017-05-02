---
layout: post
title: "Tons of Waste"
author: Brice V.
summary: An analysis of hazardous waste being generated across our country and why you should care. 
image: '/images/flint.jpg'
date: 2017-04-26 13:57:19
categories: [analysis, data, civic]
tags: [civic hacking, epa, environmental protection agency, data, analysis, engagement, flint, michigan, waste management, hazardous]
---
{% comment %}
	image tag above needs to be 200x200
{% endcomment %}

Our country has a hazardous waste problem. I will mostly feign politicial ignorance moving forward, but part of my aim here is to persaude you that this country has trended positively when it comes to improving our environment and we can't just let this one mudslide (like what I did there?). 

With Trump's appointment of Scott Pruitt, I have really started to worry. There are few things nearer and dearer to me than mother nature itself and if I can convince you to take any action here, it would be this: 

- On Feb 24, 2017, Trump signed Executive Order 13777, which would require federal agencies to establish a Regulatory Reform Task Force to evaluate existing regulations and make recommendations to the agency head (SCOTT PRUITT PEOPLE) to repeal, replace or modify said reg. The EPA has requested public comment on the regulations that have safe-guarded the outdoors since Rachel Carson's Silent Spring in 1962 (well, EPA wasn't formed until 1970, but you get the point). So here's the ask - go comment: [Regulations.gov][reggov].

Did you do it??? If you are still stuck on how to make a specific comment, perhaps this information can help you. Recently motivated by the May 15 deadline for comment, my love of the outdoors, my wife's recent visit to Denver (apparently it's the most polluted zip code in the country), and the availability of an EPA open data set that hasn't yet been removed by Trump's administration, I decided to make a few charts. Who doesn't like charts!?

Like any good market-sizing problem, I first wanted to understand the volume of potential pollutants. Understanding the year over year waste generation seemed like a good starting point. Interestingly, our past production of hazardous waste declined significantly over time and is most evident post-2003. The uptick in hazardous waste doesn't increase again until 2013. 

<center><h2>Hazardous Waste Generated Over Time</h2></center>
<center><h5>in Millions of Tons</h5></center>

<div id="waste_by_year"></div>
<script>
  var chart = c3.generate({
      data: {
        onclick: function (d, element) { console.log(d.x); },
        x: 'x',
        json: {
            x: [1991,1993,1995,1997,1999,2001,2003,2005,2007,2009,2011,2013,2015],
            waste_generated: [408.53,522.53,420.88,435.97,426.97,192.59,245.58,29.04,24.56,29.30,30.11,127.19,77.30],
            waste_received: [9.73,21.24,11.56,10.47,9.15,7.79,7.30,7.46,6.34,6.65,5.45,6.23,6.29]
        },
        types: {
            waste_generated: 'bar',
            waste_received: 'bar'
        },
        groups: [
            ['waste_generated', 'waste_received']
        ]
      },
      x: {
        type: 'date',
        tick: {
            format: '%Y'
        }
      },
      bindto: '#waste_by_year'
  });
</script>

This data comes from the Biennial Reporting System ([BRS][brs]), which is one of EPA's primary tools for tracking the generation, shipment, and receipt of hazardous waste. It contains information from Hazardous Waste Reports that must be filed every two years (which means that the data you see above represents waste from a year in arrear) under the RCRA program. RCRA (the Resource Conservation and Recovery Act) is the Federal statute that regulates the generation, treatment, storage, disposal, or recycling of solid and hazardous waste. Facilities must report their activities involving hazardous waste to BRS if they fulfill one of two criteria:

[brs]: http://www.rtk.net/brs/genhelp.php

- They are a Large Quantity Generator (LQG) of waste (which is more than 2,200 lbs/month), or
- They treated, stored, or disposed (TSD) of RCRA hazardous waste on site in units subject to RCRA permitting requirements.

Of particular importance here, are the definitions of generated waste and received waste:

- **Generated Waste** - A hazardous waste that is generated at a BRS facility. It may later be managed on-site or sent off-site for management.

- **Received Waste** - A hazardous waste that is received by a BRS facility from an off-site location, for purposes of storage or management.

So, I'm not an expert, but this seems like a massive amount of waste. Remember, the unit is in MILLIONS of TONS. There are specific rules about how long that waste can sit on site (90 days) before it's sent off-site to be handled by a waste-management company. If you can believe it, this waste sits in sealed containers, tanks, drip pads, or containment buildings. If the treatment happens on site, which can eventually include land disposal, a waste analysis plan has to be created and maintained. 

Now imagine if this got de-regulated and these companies started disposing the waste in your local river or watershed because when given the chance, why wouldn't a profit-maximizing company reduce the cost of proper waste disposal! It sounds sensational, but these are the specifics we need to acknowledge to bring light to what we could lose - mother nature, man.  I think both sides of the aisle can agree on this one. If you are interested, please read a concise summary of the requirements here: [Requirements][req]

[req]: https://www.epa.gov/sites/production/files/2014-12/documents/k01005.pdf

But enough about this, we want to know who the hell is generating this waste. Well, without further ado, I present the top 5 companies of hazardous waste generation, from 1991 - 2003 and 2005 - 2015, respectively. Because there was such a stark difference in the waste generation pre and post-2003, I really wanted to understand who the latest movers were. Now, let's remember, these aren't the bad guys, necessarily. They produce waste as a by-product of their manufacturing processes, and if it's reported in this database, they are following the law. That's a good thing, but like I said earlier, if this gets de-regulated, would you really trust every single one of these companies to deal with their waste appropriately? I'm not sure I would.

<br />

<center><h2>Top 5 Producers of Hazardous Waste</h2></center>
<center><h5>in Tons</h5></center>
<br />
<center>
<div class="row">
  <div class="col-xs-6">
    <h5>Top 5 companies from 1991 - 2003</h5> 
    <br />
    <table id="example">
      <thead>
        <tr>
          <th scope="col">Company</th>
          <th scope="col">Waste Generated</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>EASTMAN KODAK COMPANY</td>
          <td>578,414,963</td>
        </tr>
        <tr>
          <td>SUNOCO</td>
          <td>107,836,464</td>
        </tr>
        <tr>
          <td>DU PONT DE NEMOURS</td>
          <td>98,119,033</td>
        </tr>
        <tr>
          <td>DOW CHEMICAL COMPANY</td>
          <td>80,909,727</td>
        </tr>
        <tr>
          <td>DENVER METAL FINISHING</td>
          <td>54,408,140</td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="col-xs-6">
    <h5>Top 5 companies from 2005 - 2015</h5>
    <br />
    <table id="example">
      <thead>
        <tr>
          <th scope="col">Company</th>
          <th scope="col">Waste Generated</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>EASTMAN KODAK COMPANY</td>
          <td>52,157,991</td>
        </tr>
        <tr>
          <td>MPM SILICONES LLC</td>
          <td>33,454,069</td>
        </tr>
        <tr>
          <td>ASCEND CHOCOLATE BAYOU</td>
          <td>21,487,468</td>
        </tr>
        <tr>
          <td>RUBICON INC</td>
          <td>13,489,357</td>
        </tr>
        <tr>
          <td>SOLUTIA INC</td>
          <td>11,154,686</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
</center>
<br />
<br />

<center><h2>Top 5 Producers of Hazardous Waste</h2></center>
<center><h5>in Millions of Tons (for both cohorts)</h5></center>

<div id="companies_over_time"></div>
<script>
var chart = c3.generate({
    data: {
        onclick: function (d, element) { console.log(d.x); },
        x: 'x',
        json: {
            x: [1991,1993,1995,1997,1999,2001,2003,2005,2007,2009,2011,2013,2015],
            eastman_kodak: [74.41,76.56,82.27,86.72,84.52,40.72,81.05,0.18,0.01,0.03,0.03,51.48,0.43],
            sunoco: [13.87,24.67,22.90,30.99,15.41,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00],
            dupont: [34.83,22.34,10.11,8.69,8.54,3.04,1.54,1.25,1.74,1.64,1.77,1.53,1.10],
            dow: [8.49,36.59,25.07,8.81,1.21,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.75],
            denver_metal: [0.01,0.05,0.03,0.06,0.05,54.21,0.00,0.00,0.00,0.00,0.07,0.00],
            mpm_silicones: ['','','','','','','','','','','',15.91,17.54],
            ascend_chocolate_bayou_plant: ['','','','','','','','','','',4.35,8.52,8.62],
            rubicon: ['',1.41,1.48,1.53,1.76,1.86,1.95,2.10,2.53,1.56,2.17,2.54,2.59],
            solutia: ['','','',1.44,5.80,8.03,4.92,4.38,3.17,3.60,0.00,0.00,0.00]
        },
        types: {
            eastman_kodak: 'spline',
            sunoco: 'spline',
            dupont: 'spline',
            dow: 'spline',
            denver_metal: 'spline',
            mpm_silicones: 'spline',
            ascend_chocolate_bayou_plant: 'spline',
            rubicon: 'spline',
            solutia: 'spline'
        }
      },
      x: {
        type: 'date',
        tick: {
            format: '%Y'
        }
      },
      bindto: '#companies_over_time'
    });

</script>

<br />
<br />

I feel a little out of breath. How about you? That's what my wife said when she was in Denver and interestingly enough, the largest producer of hazardous waste in 2001 (really 2000) appears to be Denver Metal Finishing, based out of, you guessed it, DENVER! Check out this [article][polluted] on the most polluted zip codes and tell me I'm crazy. The zip with the highest Environmental Hazard Index is Denver (80216). Now, I would never claim to have the full picture, but this paints an interesting one. Also, Kodak in 2013 (2012 when the waste was reported)...what is going on there? If anyone has any thoughts, please comment. This might be useful context: [Eastman Kodak Files for Bankruptcy][kodak]


[kodak]: https://dealbook.nytimes.com/2012/01/19/eastman-kodak-files-for-bankruptcy/

[polluted]: http://www.denverpost.com/2017/02/16/colorado-most-polluted-zip-codes/


Now to the fun part. The data also contains waste generated by each state for each reporting year. I thought it would be informative to see how the waste generated each year changed, and what better way to vizualize then with a fun interactive map. Please note that the intial scale is linear and represents total volume of waste generated for ALL years. The scale for this initial chart is 0 - 800 million tons. Once you click on a year, the scale becomes somewhat non-linear to account for the lower volumes for each individual year. You can further click on a state to get the exact waste generated for any given year.
<br />
<br />
<center><h2>State Generated Hazardous Waste Over the Years</h2></center>
<center><h5>in Millions of Tons</h5></center>
<center><h5>Click on a year to see the waste generated for that year</h5></center>
<br />

<div id="detail"></div>

<br />
<center>
  <div id="button-wrap">
    <div id="button-wrap-inner">
      <input type="button" id="1" class="btn" value="1991" onclick="updateData(1991)" />
      <input type="button" id="2" class="btn" value="1993" onclick="updateData(1993)" />
      <input type="button" id="3" class="btn" value="1995" onclick="updateData(1995)" />
      <input type="button" id="4" class="btn" value="1997" onclick="updateData(1997)" />
      <input type="button" id="5" class="btn" value="1999" onclick="updateData(1999)" />
      <input type="button" id="6" class="btn" value="2001" onclick="updateData(2001)" />
      <input type="button" id="7" class="btn" value="2003" onclick="updateData(2003)" />
      <input type="button" id="8" class="btn" value="2005" onclick="updateData(2005)" />
      <input type="button" id="9" class="btn" value="2007" onclick="updateData(2007)" />
      <input type="button" id="10" class="btn" value="2009" onclick="updateData(2009)" />
      <input type="button" id="11" class="btn" value="2011" onclick="updateData(2011)" />
      <input type="button" id="12" class="btn" value="2013" onclick="updateData(2013)" />
      <input type="button" id="13" class="btn" value="2015" onclick="updateData(2015)" />
    </div><!-- end button-wrap-inner -->
  </div><!-- end button-wrap -->
</center>
      
 <br />

<div id="waste_by_geo">
	<center><svg viewBox="0 0 1000 600"></svg></center>
</div>

<script>
// ** Update data section (Called from the onclick)
  function updateData(year) {

    console.log(year);

    d3.queue()
    .defer(d3.json, "https://d3js.org/us-10m.v1.json")
    .defer(d3.tsv, "https://raw.githubusercontent.com/bvallier/tiny_datas/master/waste_by_state.tsv", function(d) { 
      
      if (d.year === String(year)) {
        //console.log(d);
        waste_by_state.set(d.id, +d.waste); 
      }
    })
    .await(ready);

    svg.selectAll("g").remove(); // remove the old key

    function ready(error, us) {

    var x = d3.scale.linear()
    .domain([0, 200])
    .range([150, 850]);

    var color = d3.scaleThreshold()
    .domain([0,5,10,25,50,75,100,150,200])
    .range(["#2c7bb6", "#00a6ca","#00ccbc","#90eb9d","#ffff8c","#f9d057","#f29e2e","#e76818","#d7191c"]);

      var g = svg.append("g")
      .attr("class", "key2");

      g.selectAll("rect")
        .data(color.range().map(function(d) {
            d = color.invertExtent(d);
            if (d[0] == null) d[0] = x.domain()[0];
            if (d[1] == null) d[1] = x.domain()[1];
            return d;
          }))
        .enter().append("rect")
          .transition()
          .duration(1000)
          .attr("height", 8)
          .attr("x", function(d) { return x(d[0]); })
          .attr("width", function(d) { return x(d[1]) - x(d[0]); })
          .attr("fill", function(d) { return color(d[0]); });

      g.call(d3.axisBottom(x)
          .tickSize(10)
          .tickFormat(function(x, i) { return i ? x : x + "M"; })
          .tickValues(color.domain()))
        .select(".domain")
          .remove();

        state_mapping = {
          "48":"Texas",
          "36":"New York",
          "22":"Louisiana",
          "47":"Tennessee",
          "42":"Pennsylvania",
          "20":"Kansas",
          "23":"Maine",
          "06":"California",
          "26":"Michigan",
          "34":"New Jersey",
          "17":"Illinois",
          "21":"Kentucky",
          "08":"Colorado",
          "13":"Georgia",
          "18":"Indiana",
          "51":"Virginia",
          "28":"Mississippi",
          "53":"Washington",
          "40":"Oklahoma",
          "01":"Alabama",
          "09":"Connecticut",
          "35":"New Mexico",
          "56":"Wyoming",
          "54":"West Virginia",
          "27":"Minnesota",
          "25":"Massachusetts",
          "39":"Ohio",
          "04":"Arizona",
          "49":"Utah",
          "41":"Oregon",
          "05":"Arkansas",
          "29":"Missouri",
          "32":"Nevada",
          "16":"Idaho",
          "37":"North Carolina",
          "12":"Florida",
          "19":"Iowa",
          "24":"Maryland",
          "15":"Hawaii",
          "38":"North Dakota",
          "10":"Delaware",
          "55":"Wisconsin",
          "31":"Nebraska",
          "44":"Rhode Island",
          "45":"South Carolina",
          "33":"New Hampshire",
          "50":"Vermont",
          "02":"Alaska",
          "30":"Montana",
          "46":"South Dakota"
        }

      if (error) throw error;

      var tIn = d3.transition().duration(1000).ease(d3.easeSinIn)

      svg
        .append("g")
        .attr("class", "states")
        .selectAll("path")
        .data(topojson.feature(us, us.objects.states).features)
        .enter().append("path")
        .attr("fill", function(d) { 
          return color(d.waste = waste_by_state.get(d.id));
        })
        .attr("d", path)
        .on('click', function(d) {
          $('#detail').html('<center><h2>'+state_mapping[d.id]+':'+d.waste+'</h2> <strong>Million Tons Generated</strong></center>');
        })
        .on("mouseover", function() {
          d3.select(this)
            .attr("fill", 'purple')
            .attr("style", 'cursor:pointer')
        })
        .on("mouseout", function() {
          d3.select(this)
            .attr("fill", function(d) { 
              //console.log(d);
              return color(d.waste = waste_by_state.get(d.id));
            })
        }).transition(tIn).delay(function (d, i) { return Math.random() * 1000 })
        .append("title")
          .text(function(d) { return d.waste + " million tons"; 

      })

    }
  }
</script>

<style>


.btn {
  -webkit-border-radius: 2;
  -moz-border-radius: 2;
  border-radius: 2px;
  font-family: Arial;
  color: #ffffff;
  font-size: 12px;
  background-color: black;
  text-decoration: none;
  margin-bottom: 5px;
}

.btn:hover {
  background: #3cb0fd;
  background-image: -webkit-linear-gradient(top, #3cb0fd, #3498db);
  background-image: -moz-linear-gradient(top, #3cb0fd, #3498db);
  background-image: -ms-linear-gradient(top, #3cb0fd, #3498db);
  background-image: -o-linear-gradient(top, #3cb0fd, #3498db);
  background-image: linear-gradient(to bottom, #3cb0fd, #3498db);
  text-decoration: none;
}


.counties {
  fill: none;
}

.states {
  fill: none;
  stroke: #fff;
  stroke-linejoin: round;
}
.line {
  fill: none;
  stroke: #6F257F;
  stroke-width: 5px;
}

.overlay {
  fill: none;
  pointer-events: all;
}

.focus circle {
  fill: #F1F3F3;
  stroke: #6F257F;
  stroke-width: 5px;
}
  
.hover-line {
  stroke: #6F257F;
  stroke-width: 2px;
  stroke-dasharray: 3,3;
}

.key {

}

</style>

<script src="https://d3js.org/d3.v4.min.js"></script>
<script src="https://d3js.org/d3-scale-chromatic.v1.min.js"></script>
<script src="https://d3js.org/topojson.v2.min.js"></script>
<script>

var svg = d3.selectAll("#waste_by_geo").select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var waste_by_state = d3.map();

d3.queue()
  .defer(d3.json, "https://d3js.org/us-10m.v1.json")
  .defer(d3.tsv, "https://raw.githubusercontent.com/bvallier/tiny_datas/master/waste_by_state.tsv", function(d) { 
    //console.log(d);
    waste_by_state.set(d.id, +d.waste_total_by_state); 
  })
  .await(ready);

var path = d3.geoPath();

var x = d3.scale.linear()
    .domain([0, 800])
    .range([150, 850]);

var color = d3.scaleThreshold()
    .domain([0,100,200,300,400,500,600,700,800])
    .range(["#2c7bb6", "#00a6ca","#00ccbc","#90eb9d","#ffff8c","#f9d057","#f29e2e","#e76818","#d7191c"]);

var g = svg.append("g")
    .attr("class", "key");

g.selectAll("rect")
  .data(color.range().map(function(d) {
      d = color.invertExtent(d);
      if (d[0] == null) d[0] = x.domain()[0];
      if (d[1] == null) d[1] = x.domain()[1];
      return d;
    }))
  .enter().append("rect")
    .attr("height", 8)
    .attr("x", function(d) { return x(d[0]); })
    .attr("width", function(d) { return x(d[1]) - x(d[0]); })
    .attr("fill", function(d) { return color(d[0]); });

g.call(d3.axisBottom(x)
    .tickSize(10)
    .tickFormat(function(x, i) { return i ? x : x + "M"; })
    .tickValues(color.domain()))
  .select(".domain")
    .remove();



function ready(error, us) {

	state_mapping = {
		"48":"Texas",
		"36":"New York",
		"22":"Louisiana",
		"47":"Tennessee",
		"42":"Pennsylvania",
		"20":"Kansas",
		"23":"Maine",
		"06":"California",
		"26":"Michigan",
		"34":"New Jersey",
		"17":"Illinois",
		"21":"Kentucky",
		"08":"Colorado",
		"13":"Georgia",
		"18":"Indiana",
		"51":"Virginia",
		"28":"Mississippi",
		"53":"Washington",
		"40":"Oklahoma",
		"01":"Alabama",
		"09":"Connecticut",
		"35":"New Mexico",
		"56":"Wyoming",
		"54":"West Virginia",
		"27":"Minnesota",
		"25":"Massachusetts",
		"39":"Ohio",
		"04":"Arizona",
		"49":"Utah",
		"41":"Oregon",
		"05":"Arkansas",
		"29":"Missouri",
		"32":"Nevada",
		"16":"Idaho",
		"37":"North Carolina",
		"12":"Florida",
		"19":"Iowa",
		"24":"Maryland",
		"15":"Hawaii",
		"38":"North Dakota",
		"10":"Delaware",
		"55":"Wisconsin",
		"31":"Nebraska",
		"44":"Rhode Island",
		"45":"South Carolina",
		"33":"New Hampshire",
		"50":"Vermont",
		"02":"Alaska",
		"30":"Montana",
		"46":"South Dakota"
  }

  if (error) throw error;

  //rollup records by id
  //var waste_by_year = d3.nest()
  //.key(function(d) { return d.id;})
  //.rollup(function(d) { 
  // return d3.sum(d, function(g) {
  //    d.set(d.id, +d.waste); 
  //  });
  //}).entries(waste);

  //console.log(waste_by_year);

  svg
    .append("g")
    .attr("class", "states")
    .selectAll("path")
    
    .data(topojson.feature(us, us.objects.states).features)
    
    .enter().append("path")
    
    .attr("fill", function(d) { 
      //console.log(d);

      var year = d3.select('#year').value;

      console.log(year);
      return color(d.waste_total_by_state = waste_by_state.get(d.id));
    })
    
    .attr("d", path)
    
    .on('click', function(d) {
    	$('#detail').html('<center><h2>'+state_mapping[d.id]+':'+d.waste_total_by_state+'</h2> <strong>Million Tons Generated</strong></center>');
    })
    
    .on("mouseover", function() {
      d3.select(this)
        .attr("fill", 'purple')
        .attr("style", 'cursor:pointer')
    })
    
    .on("mouseout", function() {
      d3.select(this)
        .attr("fill", function(d) { 
          //console.log(d);
          return color(d.waste_total_by_state = waste_by_state.get(d.id));
        })
    })
    .append("title")
      .text(function(d) { return d.waste_total_by_state + " million tons"; 

  });


}

</script>


<br />
<br />


<h5>The question I want to ask all of you: Would you want this waste disposed of in your back yard? To reiterate my initial point - please take the time to comment:</h5> 

**[PUBLIC COMMENTS][reggov]**


[reggov]: https://www.regulations.gov/docketBrowser?rpp=50&so=DESC&sb=postedDate&po=0&dct=PS&D=EPA-HQ-OA-2017-0190


Methodology:
- Data was scraped from BRS by swapping out year in the parameter of the URL.
- Data was aggregated by year for waste generated, recieved, and by geography.
- Data was cleaned in SQL.
- - In many cases, the reporting companies had naming inconsistencies, so I had to manually map the names for one company. This could be error-prone. This wouldn't include subsidiaries. Someone should come up with an API for this!
- Data was visualized using d3, c3.
- Data was stored and fetched on my github account, where the code for this is stored. It's a little messy. Ship > pretty code.
- As always, I'm a shop of one, so if I made a mistake, let me know and I'll look into and make corrections if needed. 


<br />
<br />

{% include disqus.html %} 
