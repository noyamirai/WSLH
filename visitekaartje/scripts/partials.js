const setPromptPartial = (currentPromptsLength) => {

    let id = currentPromptsLength + 1;
    const promptHtml = '<form action="GET" id="prompt-form-' + id + '"><fieldset class="prompt"><div><label class="prompt__label" for="term-prompt"><span class="blue">guest</span><span class="green">@term.noya:</span><span class="blue">~</span></label><div class="growing-input js-growingInputContainer"><input class="prompt__input" type="text" name="user_prompt" id="promptInputField" placeholder="help"></div></div><p class="prompt__time js-current_time">04:47:23 PM</p></fieldset></form>';

    return {html: promptHtml, 'promptId': id};
}

const insertPromptPartial = (currentPromptsLength) => {

    const promptHtml = setPromptPartial(currentPromptsLength);

    let lastRevealedSection = document.querySelectorAll(".info--revealed");
    lastRevealedSection = lastRevealedSection[lastRevealedSection.length-1];

    lastRevealedSection.parentElement.innerHTML += promptHtml.html;

}