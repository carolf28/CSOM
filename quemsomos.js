
const form = document.querySelector('.contact-form');
const thankYou = document.getElementById('thankyou-message');

form.addEventListener('submit', async (e) => {
  e.preventDefault(); // prevent default submission

  const formData = new FormData(form);
  const response = await fetch(form.action, {
    method: 'POST',
    body: formData,
    headers: { 'Accept': 'application/json' }
  });

  if (response.ok) {
    form.style.display = 'none';       // hide the form
    thankYou.style.display = 'block';   // show thank you
  } else {
    alert('Oops! Something went wrong.');
  }
});

