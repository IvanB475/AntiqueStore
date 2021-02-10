var stripe = Stripe('pk_test_51IInAVDeWinF5kKHidFQSu3cVFzhuqpW7NKDYQxR32Hhl4Yri9EitRpQo4VHJtIVuZgFG3goyupf1cKlxZEF6jSU00jNkFXsda');
var checkoutButton = document.getElementById('checkout-button');
var token = document.getElementById('token').value;
var totalPrice = document.getElementById('totalPrice').innerText;


checkoutButton.addEventListener('click', function() {
  // Create a new Checkout Session using the server-side endpoint you
  // created in step 3.
  fetch('/createCheckoutSession', {
    credentials: 'same-origin',
    headers: {
      'CSRF-Token': token,
      'Content-Type': 'application/json'
    }, 
    method: 'POST',
    body: JSON.stringify({totalPrice: totalPrice})
  })
  .then(function(response) {
    return response.json();
  })
  .then(function(session) {
    return stripe.redirectToCheckout({ sessionId: session.id });
  })
  .then(function(result) {
    // If `redirectToCheckout` fails due to a browser or network
    // error, you should display the localized error message to your
    // customer using `error.message`.
    if (result.error) {
      alert(result.error.message);
    }
  })
  .catch(function(error) {
    console.error('Error:', error);
  });
});