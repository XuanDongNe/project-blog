
var ticket = [];
addItem();
renderIndex();

// ========================================================================= //
//  // VÉ Ticket
// ========================================================================= //
function addItem(selectedCategory) {
    const newItem = {
        name: JSON.parse(localStorage.getItem("selectedCategory"))
    };
    ticket.push(newItem);

    sessionStorage.setItem('ticket', JSON.stringify(ticket));

    render(false);
}

function render(isRemove) {
    let categoryItem = JSON.parse(sessionStorage.getItem('ticket')) ?? ticket;
    if (categoryItem.length < 1) {
        var nullChosen = document.querySelector('.chosen-list');
        return nullChosen.style.display = 'none';
    }
    renderSpan(categoryItem, isRemove);

}

function renderIndex() {
    const sub_select = JSON.parse(sessionStorage.getItem('ticket')) ?? ticket; // xu li chi muc 
    let indexContainer = document.querySelector('.sub-select');
    for (let i = 0; i < 1; i++) {
        let h3 = document.createElement('h3');
        h3.innerHTML = `<h3> ${sub_select[0].name} </h3>`;
        indexContainer.appendChild(h3);
        break;
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
    // Xóa phần tử từ mảng ticket.
    if (index >= 0 && index < ticket.length) {
        ticket.splice(index, 1);
    }
    // Cập nhật 'ticket' trong sessionStorage.
    sessionStorage.setItem('ticket', JSON.stringify(ticket));
    // Render sau khi xóa.
    render(true);
}


// ========================================================================= //
//  // call api province
// ========================================================================= //

let provincesVietNam = [];
let provincesThaiLand = [];

async function getApiVietNam() {
    try {
        let response = await axios.get("https://provinces.open-api.vn/api/");
        provincesVietNam = Object.keys(response.data).map(key => response.data[key]);
        renderData(provincesVietNam, "vietnam");
    } catch (e) {
        console.error("Error fetching data:", e);
    }
}

async function getApiThaiLand() {
    try {
        let response = await axios.get("https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province_with_amphure_tambon.json");
        provincesThaiLand = Object.keys(response.data).map(key => response.data[key]);
        console.log(provincesThaiLand);
        renderData(provincesThaiLand, "thailand");
    } catch (e) {
        console.error("Error fetching data:", e);
    }
}

function renderData(provinces, country) {
    let treeSetItem = document.querySelector(`.klk-tree-node.main.${country}`);
    provinces.forEach((value, index) => {
        let div = document.createElement('div');
        div.className = 'klk-tree-sub klk-tree-node';
        div.style.paddingLeft = '32px';
        div.innerHTML = `
            <div class="klk-tree-node-inner" onclick ="checkRender('${index}',event, '${country}')">
                <span class="klk-checkbox" >
                    <span class="klk-checkbox-base klk-checkbox-normal api"><input type="checkbox" name="" id="">
                    <i class="fa-solid fa-check"></i></span>
                </span>
                <span class="klk-tree-node-title">
                ${country === 'vietnam' ? value.name : value.name_en}
                </span>
            </div>`;
        treeSetItem.appendChild(div);
    });
}


function checkRender(index, event, country) {
    event.stopPropagation();
    let countryOfSelect = document.querySelector(`.klk-tree-node.main.${country}`);
    let treeSetItem = countryOfSelect.querySelectorAll('.klk-tree-sub');
    let checkboxElement = treeSetItem[index].querySelector('.klk-checkbox-base.api');
    let nodeName = treeSetItem[index].querySelector('.klk-tree-node-title').textContent.trim();

    // Toggle the 'klk-checkbox-checked' class
    checkboxElement.classList.toggle('klk-checkbox-checked');

    isClickCheckbox(checkboxElement, nodeName);
}

function addSelectIntoTicket(name) {
    ticket.push({ name: name });
    sessionStorage.setItem('ticket', JSON.stringify(ticket));
    render(true);
}

getApiVietNam();
getApiThaiLand();

// ========================================================================= //
//  // checbox destination and categories
// ========================================================================= //
// Checkboxes for destination 
const checkDTNs = document.querySelectorAll('.klk-tree-node.destination');
checkDTNs.forEach(checkDTN => {
    checkDTN.addEventListener('click', (event) => toggleCheckDTN(checkDTN, event));
});

function toggleCheckDTN(checkDTN, event) {
    // Kiểm tra xem phần tử được nhấp vào có phải là klk-checkbox-base không
    if (event.target.closest('.klk-checkbox-base')) {
        // Nếu là klk-checkbox-base, thì không thực hiện toggle show/hidden
        return;
    }

    toggleShowHide(checkDTN);
}

function toggleShowHide(element) {
    let subElements = element.querySelectorAll('.klk-tree-sub');
    let icon = element.querySelector('.fa-angle-down');
    icon.classList.toggle('rotate');
    subElements.forEach(subElement => {
        //thêm class show bằng cách bật tắt
        subElement.classList.toggle('show');
    });
}

// Checkboxes for categories 
const checkBoxes = document.querySelectorAll('.klk-tree-node-inner');
checkBoxes.forEach(checkBox => {
    checkBox.addEventListener('click', (event) => toggleCheckBox(checkBox, event));
});

function toggleCheckBox(checkBox, event) {
    if (event.target.closest('.klk-tree-node.destination')) {
        toggleCheckInput(checkDTN.querySelector('.klk-checkbox-base'), event);
        return;
    }

    let checkboxElement = checkBox.querySelector('.klk-checkbox-base');
    let nodeName = checkBox.querySelector('.klk-tree-node-title').textContent.trim();

    // Toggle the class on the checkbox
    checkboxElement.classList.toggle('klk-checkbox-checked');

    isClickCheckbox(checkboxElement, nodeName);
}

const checkInputs = document.querySelectorAll('.klk-checkbox-base');
checkInputs.forEach(checkInput => {
    checkInput.addEventListener('change', (event) => toggleCheckInput(checkInput, event));
});

function toggleCheckInput(checkInput, event) {
    event.stopPropagation();
    if (event.target.closest('.klk-tree-node.destination')) {
        return;
    }
    let nodeName = checkInput.querySelector('.klk-tree-node-title').textContent.trim();
    checkInput.classList.toggle('klk-checkbox-checked');
    isClickCheckbox(checkInput, nodeName);
}

function isClickCheckbox(element, name) {
    if (element.classList.contains('klk-checkbox-checked')) {
        // Nếu có, thì thêm vào ticket
        addSelectIntoTicket(name);
    } else {
        // Nếu không, thì xóa khỏi ticket
        const categoryItem = JSON.parse(sessionStorage.getItem('ticket')) || ticket;
        const index = categoryItem.findIndex(item => item.name === name);
        deleteItem(index);
    }
}

// ========================================================================= //
//  // CLEAR ALL SELECTION
// ========================================================================= //
const clearAll = document.querySelector('.clear-selection');
clearAll.addEventListener('click', (event) => getClearAllSelect(clearAll, event));

function getClearAllSelect() {
    ticket.splice(0, ticket.length); // Xóa hết phần tử trong mảng
    sessionStorage.setItem("ticket", JSON.stringify(ticket));
    render(true);
}




