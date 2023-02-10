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

 async function startType(string, textEl, typed, index, skip = false) {
    return new Promise(resolve => {

        if (index < string.length) {
            // console.log('typing!');

            const char = string.charAt(index);
            typed += char;

            let resultObj = {
                finished: false,
                string: string,
                typed: typed,
                nIndex: index,
                skip: false
            }

            // moving onto next char (complete html entity)
            if (skip && char != ';') {
                // console.log('STILL HTML ENTITY');
                index++;
                resultObj.skip = true;
                resultObj.nIndex = index;

                resolve(resultObj);
                return;
            }

            // If its HTML entity -> don't display until its completed (;)
            if (char == '&') {
                // console.log('HTML ENTITY');
                index++;
                resultObj.skip = true;
                resultObj.nIndex = index;

                resolve(resultObj);
                return;
            }

            // console.log('NORMAL TEXT/END OF ENTITY');

            textEl.innerHTML = typed;
            index++;

            resultObj.nIndex = index;
            resultObj.skip = false;

            setTimeout(function() {
                resolve(resultObj)
            }, 55);
        }

        if (index == string.length) {
            // console.log('done typing, go next');
            resolve({finished:true})
            return;                
        }

    })
}

async function processParagraphs(paragraphs, index) {
    // console.log('attempting paragraph index: ' + index);
    // console.log(index);
    // console.log(paragraphs.length);

    // All elements have been animated
    if (index >= paragraphs.length) {
        // console.log('DONE PROCESSING');
        return true;
    }

    // console.log('we have permission for do-while!');

    const paragraph = paragraphs[index];
    paragraph.classList.remove('hide');

    let result;  

    // Will continue calling startType() until resolve has finished:true
    do {
        // console.log('attempt...');
        // console.log(result);
        // console.log((result && result.skip ? true : false));
        // console.log('startType()');
        
        result = await startType(
            (result && result.string ? result.string : paragraph.innerHTML),
            paragraph, 
            (result && result.typed ? result.typed: ''), 
            (result && result.nIndex ? result.nIndex: 0), 
            (result && result.skip ? true : false)
        );

    } while (!result.finished);

    // Finished
    // console.log('FINISHEDDDD');
    // console.log(result);

    // Recursion
    index++;
    return processParagraphs(paragraphs, index);
}

// SOURCE: chat.openai.com/chat
const logVisit = () => {
    // Get the current date and time
    let currentDate = new Date();

    // Convert the date and time to a string in the desired format
    let dateString = currentDate.toLocaleString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });

    // Save the date and time to local storage
    localStorage.setItem("lastVisit", dateString);
    return true;
}

const retrieveLastVisit = () => {

    if("lastVisit" in localStorage){
        let lastVisit = localStorage.getItem("lastVisit");
        return lastVisit
    }

    logVisit();
    return;
}