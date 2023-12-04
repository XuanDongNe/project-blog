var ticket = [];
addItem();
function addItem(selectedCategory) {
    const newItem = {
        name: JSON.parse(localStorage.getItem("selectedCategory"))
    };
    ticket.push(newItem);

    sessionStorage.setItem('ticket', JSON.stringify(ticket));

    render();
}

function render() {
    const categoryItem = JSON.parse(sessionStorage.getItem('ticket')); // xu li chosen
    const sub_select = JSON.parse(sessionStorage.getItem('ticket')); // xu li chi muc 
    if (categoryItem.length < 1) {
        var nullChosen = document.querySelector('.chosen-list');
        return nullChosen.style.display = 'none';
    }
    renderIndex(sub_select);
    renderSpan(categoryItem);

}

function renderIndex(sub_select) {
    let indexContainer = document.querySelector('.sub-select');
    for (let i = 0; i < sub_select.length; i++) {
        let h3 = document.createElement('h3');
        h3.innerHTML = `<h3> ${sub_select[i].name} </h3>`;
        indexContainer.appendChild(h3);
    }
}


function renderSpan(categoryItem) {
    let itemList = document.querySelector('.item-list');



    categoryItem.forEach((item, index) => {
        //xử lí cho phần chọn categoryItem
        let span = document.createElement('span');
        span.innerHTML = `<div class="selected-tag">
                            <div class="name">${item.name}</div> 
                            <i class='bx bx-x'></i>
                        </div>`;
        itemList.appendChild(span);
    });


}

