---
layout: page
title: Data
permalink: /data.html
---

Data for sale

<form action="https://bvallieres.com/stripe-hook" method="POST">
  <script
    src="https://checkout.stripe.com/checkout.js" class="stripe-button"
    data-key="pk_test_Pn1zmm2b4NoYM43lDZMM6cJr"
    data-amount="2000"
    data-name="wired. thoughts."
    data-description="2 widgets ($20.00)"
    data-image="{{ site.images }}/logo.PNG">
  </script>
  <input name="amount" value="2000" type="hidden">
</form>

{% include stripe.html %} 

