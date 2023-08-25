const socket = io();
const messages = document.getElementById("messages");
const userInputElement = document.getElementById("user");
const messageInputElement = document.getElementById("message");
const saveUserNameBtn = document.getElementById("saveUserName");

const updateMessages = (data) => {
    messages.innerHTML = "";
    let salida = "";

    data.forEach((item) => {
        salida += `
        <p class="card-text"><b>${item.user}:</b> <span class="fw-light">${item.message}</span></p>
        `;
    });

    messages.innerHTML = salida;
};

socket.on("messages", (data) => {
    updateMessages(data);
});

const sendMessage = () => {
    const user = userInputElement.value;
    const message = messageInputElement.value;
    socket.emit("newMessage", { user, message });
    messageInputElement.value = "";
};

const openModal = () => {
    const modalUserNameInput = document.getElementById("modalUserName");
    const storedName = localStorage.getItem("userName");
    if (storedName) {
        modalUserNameInput.value = storedName;
    }
    const nameModal = new bootstrap.Modal(document.getElementById("nameModal"));
    nameModal.show();
};

const saveUserName = () => {
    const modalUserNameInput = document.getElementById("modalUserName");
    const newName = modalUserNameInput.value;
    if (newName.trim() !== "") {
        userInputElement.value = newName;
        localStorage.setItem("userName", newName);
        const nameModal = bootstrap.Modal.getInstance(document.getElementById("nameModal"));
        nameModal.hide();
        Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmationButton: false,
            timer: 3000,
            title: `${newName} te uniste al chat`,
            icon: 'success'
        })
    }
};

btnSendMessage.addEventListener("click", sendMessage);
saveUserNameBtn.addEventListener("click", saveUserName);

const storedName = localStorage.getItem("userName");
if (!storedName) {
    openModal();
}
