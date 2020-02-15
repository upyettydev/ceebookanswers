const adminPhoneField = document.querySelector("#admin-phone");
const adminPasswordField = document.querySelector("#admin-password");
const adminLoginBtn = document.querySelector("#admin-login-btn");
const adminLoginErrorMessage = document.querySelector("#admin-login-error-message");
const adminLoginSpanner = document.querySelector('#admin-login-spanner');

adminLoginBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const phone = adminPhoneField.value;
  const password = adminPasswordField.value;

  adminLoginErrorMessage.textContent = "";
  adminLoginErrorMessage.classList.add("d-none");
  adminLoginSpanner.classList.remove('d-none');

  try {
    const adminLoginData = await adminSubmitLoginDetails(phone, password);

    if (adminLoginData.error) {
      throw new Error(adminLoginData.error.message);
    }

    window.localStorage.setItem('token', adminLoginData.data.token);

    adminLoginSpanner.classList.add('d-none');
    window.location = "./admin-dashboard.html";
  } catch (e) {
    adminLoginErrorMessage.classList.remove('d-none');
    adminLoginSpanner.classList.add('d-none');
    adminLoginErrorMessage.textContent = e.message;
  }
});

const adminSubmitLoginDetails = async (phone, password) => {
  const fetchUrl = ` https://ceebookanswers.herokuapp.com/admins/login`;
  const data = {phone, password};
  try {
    const response = await fetch(fetchUrl, {
      method: 'POST',
      mode: 'cors',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data)
    });
    return await response.json();
  } catch (e) {
    console.log(e.message);
  }
};