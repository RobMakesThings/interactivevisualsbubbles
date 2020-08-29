// body.onload = function () {
//     var modal = document.querySelectorAll('modal');
//     modal.classList.add('is-active')
// };
function startModal() {
    addModal.classList.add('is-active');
    noLoop();
}
var addModal = document.getElementById('modal');

function closeModal() {

    // document.querySelector('modal')

    console.log(modal)
    addModal.classList.remove('is-active');
    console.log('hello')
}

var nameinput = document.getElementById('nickName');




function submitNickname() {

    console.log(nameinput.value)

    nickname = nameinput.value;
    nickname = nickname.substr(0, 4);
    addModal.classList.remove('is-active');
    loop();
}