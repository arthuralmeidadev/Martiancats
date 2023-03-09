const signUpContainer = document.querySelector(".signup-container");
const loginContainer = document.querySelector(".login-container");
const accountContainer = document.querySelector(".account-container");
const contactContainer = document.querySelector(".contact-container");


const queries = (window.location.href).split("?")[1];
const goto = queries.split("goto=")[1]; // may need better implementation

async function signUpContainerAnimationEnd () {
    if (signUpContainer.style.animationName == "signup-out") {
        signUpContainer.style.animationPlayState = "paused";
        signUpContainer.style.display = "none";

        loginContainer.style.display = "block";
        loginContainer.style.animationName = "login-in";
        loginContainer.style.animationPlayState = "running";
    };
};

async function loginContainerAnimationEnd () {
    if (loginContainer.style.animationName == "login-out") {
        loginContainer.style.animationPlayState = "paused";
        loginContainer.style.display = "none";
        
        signUpContainer.style.display = "block";
        signUpContainer.style.animationName = "signup-in";
        signUpContainer.style.animationPlayState = "running";
    };
};

signUpContainer.addEventListener("animationend", signUpContainerAnimationEnd);
loginContainer.addEventListener("animationend", loginContainerAnimationEnd);

async function jumpToHome() {
    window.scrollTo(0, 0)
};

async function jumpToContactContainer() {
    contactContainer.scrollIntoView({behavior: "smooth", block: "start"});
};

async function logInLoad() {
    accountContainer.scrollIntoView({behavior: "smooth", block: "end"});
    signUpContainer.style.animationName = "signup-out";
    signUpContainer.style.animationPlayState = "running";
};

async function signUpLoad() {
    accountContainer.scrollIntoView({behavior: "smooth", block: "end"});
    loginContainer.style.animationName = "login-out";
    loginContainer.style.animationPlayState = "running";
};

if (goto == "login") {
    logInLoad();
};