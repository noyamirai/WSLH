const displayPrevData = (previousPrompts) => {

    if (previousPrompts.length == 0) {
        return;
    }

    const allPromptInputs = document.querySelectorAll('form');

    // innerhtml resets form -> retrieve prev data and set
    for (let i = 0; i < allPromptInputs.length; i++) {
        const formEl = allPromptInputs[i];
        let id = 'promptInputField';

        // not first prompt
        if (formEl.id != 'prompt-form') {

            id += '-' + formEl.id.split('-').pop().trim();
        }

        const prevInputField = document.getElementById(id);
        prevInputField.value = previousPrompts[id];
        prevInputField.style.width = 'auto';
    }

    const newInputField = document.querySelector('input:not(:disabled)');

    newInputField.value = null;
    newInputField.style.width = '33px';
    newInputField.focus();

    return;
}

// SOURCE: chat.openai.com/chat
const getCurrentTime = () => {

    const date = new Date();

    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;

    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    const currentTime = `${hours}:${minutes}:${seconds} ${ampm}`;

    return currentTime;
}