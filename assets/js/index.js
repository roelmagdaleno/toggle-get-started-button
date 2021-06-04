function saveState(buttonEl) {
    const accessTokenEl = document.getElementById('page-access-token');
    const toggleEl = document.getElementById('toggle-get-started');

    if (!accessTokenEl || !toggleEl || accessTokenEl.value.trim() === '') {
        setMessage('danger', 'The page access token is empty.');
        return;
    }

    buttonEl.disabled = true;
    toggleSpinner();
    resetMessage();

    const version = '10.0';
    const endpoint = `https://graph.facebook.com/v${version}/me/messenger_profile?access_token=${accessTokenEl.value.trim()}`;
    const data = toggleEl.checked ? { "get_started": { "payload": "start" } } : { "fields": [ "get_started" ] };

    axios({
        method: toggleEl.checked ? 'post' : 'delete',
        url: endpoint,
        data
    }).then(response => {
        buttonEl.disabled = false;
        toggleSpinner();

        if (! response.data.result || response.data.result !== 'success') {
            setMessage('danger', response.error.message);
            return;
        }

        const enabledDisabled = toggleEl.checked ? 'enabled' : 'disabled';
        setMessage('success', `Your "Get Started" Messenger button was ${enabledDisabled}. Check your Facebook Page Messenger.`);
    }).catch(() => {
        buttonEl.disabled = false;
        toggleSpinner();

        setMessage('danger', 'Something went wrong with your request. Your access token might be invalid or malformed.');
    });
}

function resetMessage() {
    const messageEl = document.getElementById('messages');

    if (!messageEl) {
        return;
    }

    messageEl.classList.remove('alert-danger', 'alert-success');
    messageEl.innerHTML = '';
}

function setMessage(type, message) {
    const messageEl = document.getElementById('messages');

    if (!messageEl) {
        return;
    }

    messageEl.innerHTML = message;
    messageEl.classList.add(`alert-${type}`);
}

function toggleSpinner() {
    const spinnerEl = document.querySelector('.spinner-border');

    if (!spinnerEl) {
        return;
    }

    spinnerEl.classList.toggle('d-none');
}
