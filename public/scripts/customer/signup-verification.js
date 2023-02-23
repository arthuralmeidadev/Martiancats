const inputElements = [...document.querySelectorAll(".code-input")];
const form = document.querySelector(".form");
const loading = document.querySelector(".loading");
const logo = document.querySelector(".logo");

inputElements.forEach((ele, index) => {
    ele.addEventListener("keydown", (e) => {
        if(e.keyCode === 8 && e.target.value === "") {
            inputElements[Math.max(0, index - 1)].focus();
        };
    });
    ele.addEventListener("input", (e) => {
        const [first, ...rest] = e.target.value;
        const lastInputBox = index === inputElements.length-1;
        const didInsertContent = first !== undefined;

        e.target.value = first ?? ""
        if (didInsertContent && !lastInputBox) {
            inputElements[index+1].focus();
            inputElements[index+1].value = rest.join("");
            inputElements[index+1].dispatchEvent(new Event("input"));
        };

        allFIlled();
    });
});

function allFIlled() {
    var filled = 0;
    inputElements.forEach((ele, index) => {
        if (inputElements[index].value !== "") {
            filled++
        };
    });
    if (filled == 6) {
        logo.style.animationPlayState = "running";
        form.style.animationPlayState = "running";
        loading.style.animationPlayState = "running";
        inputElements[5].focus();
        inputElements[5].blur();
        form.submit();
    };
};