
var ticket = [];
addItem();


// ve tiket
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
    // addItem(categoryItem,true);
}


//call api
let provinces = []
async function getApi() {
    try {
        let data = await axios.get("https://vapi.vnappmob.com/api/province");
        provinces = data.data;
        console.log(provinces);
        renderData(provinces);
    } catch (e) {
        console.error("Error fetching data:", e);
    }
}

function renderData(provinces) {
    let treeSetItem = document.querySelector('.klk-tree-node');

    provinces.forEach((value, index) => {
        let div = document.createElement('div');
        div.className = 'klk-tree-sub klk-tree-node';
        div.style.paddingLeft = '32px';
        div.innerHTML = `
            <div class="klk-tree-node-inner">
                <span class="klk-checkbox klk-checkbox-normal">
                    <span class="klk-checkbox-base"><input type="checkbox" name="" id=""></span>
                </span>
                <span class="klk-tree-node-title">${value.province_name}</span>
            </div>`;
        // Append div vào nơi bạn muốn hiển thị
        treeSetItem.appendChild(div);
    });
}

getApi(); // Call the function to test


// Checkboxes for destination 
const checkDTNs = document.querySelectorAll('.klk-tree-node');
checkDTNs.forEach(checkDTN => {
    checkDTN.addEventListener('click', (event) => toggleCheckDTN(checkDTN, event));
});

function toggleCheckDTN(checkDTN, event) {
    // Ngăn chặn sự kiện từ việc lan truyền lên cấp cao hơn
    event.stopPropagation();

    let subElements = checkDTN.querySelectorAll('.klk-tree-sub');
    let icon = checkDTN.querySelector('.fa-angle-down');
    icon.classList.toggle('rotate');

    subElements.forEach(subElement => {
        // Toggle the 'show' class to control the display property
        subElement.classList.toggle('show');
    });
}

// Checkboxes for categories 
const checkBoxes = document.querySelectorAll('.klk-tree-node-inner');
checkBoxes.forEach(checkBox => {
    checkBox.addEventListener('click', () => toggleCheckBox(checkBox));
});

function toggleCheckBox(checkBox) {
    // Find the checkbox inside the clicked element
    let checkboxElement = checkBox.querySelector('.klk-checkbox-normal');

    // Toggle the class on the checkbox
    checkboxElement.classList.toggle('klk-checkbox-checked');
}



