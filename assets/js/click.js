var ticket = [];
addItem();
function addItem(selectedCategory) {
    const newItem = {
        name: JSON.parse(localStorage.getItem("selectedCategory"))
    };
    ticket.push(newItem);

    sessionStorage.setItem('ticket', JSON.stringify(ticket));

    render(false);
}

function render(isRemove) {
    const categoryItem = JSON.parse(sessionStorage.getItem('ticket')); // xu li chosen
    const sub_select = JSON.parse(sessionStorage.getItem('ticket')); // xu li chi muc 
    if (categoryItem.length < 1) {
        var nullChosen = document.querySelector('.chosen-list');
        return nullChosen.style.display = 'none';
    }
    renderIndex(sub_select);
    renderSpan(categoryItem, isRemove);

}

function renderIndex(sub_select) {
    let indexContainer = document.querySelector('.sub-select');
    for (let i = 0; i < sub_select.length; i++) {
        let h3 = document.createElement('h3');
        h3.innerHTML = `<h3> ${sub_select[i].name} </h3>`;
        indexContainer.appendChild(h3);
    }
}

function renderSpan(categoryItem, isRemove) {
    let itemList = document.querySelector('.item-list');

    // neu co remove thi xoa het va duyet lai tu dau 
    if (isRemove) {
        itemList.innerHTML = '';
    }
    // duyet lai phan tu chua trong categoryItem
    categoryItem.forEach((item, index) => {
        //xử lí cho phần chọn categoryItem
        let span = document.createElement('span');
        span.innerHTML = `<div class="selected-tag">
                            <div class="name">${item.name}</div> 
                            <i class='bx bx-x' onclick="deleteItem('${index}')"></i>
                        </div>`;
        itemList.appendChild(span);
    });

}

function deleteItem(index) {
    const categoryItem = JSON.parse(sessionStorage.getItem('ticket')); 
    const filterData = categoryItem.filter((_el, _index) => _index != index)
    sessionStorage.removeItem('ticket', JSON.stringify(filterData));
    sessionStorage.setItem('ticket', JSON.stringify(filterData));
    render(true);
}

