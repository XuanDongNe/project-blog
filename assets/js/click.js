
var ticket = [];

addItem();



// ========================================================================= //
//  // HAM RENDER CHO MUC TICKET OR DESTINATION DUOC CHON
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
    var nullChosen = document.querySelector('.chosen-list');
    if (categoryItem.length < 1) {
        return nullChosen.style.display = 'none';
    }
    nullChosen.style.display = 'block';
    renderSpan(categoryItem, isRemove);


}

function renderIndex() {
    const sub_select = JSON.parse(sessionStorage.getItem('ticket')) ?? ticket; // xu li chi muc 
    let indexContainer = document.querySelector('.sub-select');
   let itemDestination = document.querySelectorAll('.catalog .klk-tree-node-inner');
   let checkInputDes ;
    for (let i = 0; i < 1; i++) {
        let h3 = document.createElement('h3');
        h3.innerHTML = `<h3> ${sub_select[0].name} </h3>`;
        indexContainer.appendChild(h3);
         checkInputDes = findElementByName(itemDestination, sub_select[0].name);
        break;
    }
    checkInputDes.querySelector('.klk-checkbox-base').classList.add('klk-checkbox-checked');
    
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
                            <i class='bx bx-x' "></i>
                        </div>`;
        itemList.appendChild(span);
        span.querySelector('.bx-x').addEventListener('click', () => deleteItem(index));
    });
}


function deleteItem(index) {
    const indexOfTicket = ticket.findIndex(existingItem => existingItem.name === ticket[index].name);
    toggleCheckInputByIndex(indexOfTicket,index);

}

function toggleCheckInputByIndex(indexOfTicket, index) {
    // Lấy element có index tương ứng
    let itemDestination, itemCatalog;

    // Kiểm tra index thuộc danh sách nào
    itemDestination = document.querySelectorAll('.klk-tree-sub');
    itemCatalog = document.querySelectorAll('.catalog .klk-tree-node-inner');

    // Lấy tên của phần tử trong mảng ticket tại vị trí indexOfTicket
    const itemName = ticket[indexOfTicket].name;

    // Tìm element có tên tương ứng trong danh sách
    const checkInputDes = findElementByName(itemDestination, itemName);
    const checkInputCata = findElementByName(itemCatalog, itemName);

    if (checkInputDes != null) {
        hideCheckBox(checkInputDes, index);
    } else if (checkInputCata) {
        hideCheckBox(checkInputCata, index);
    }

}

// Hàm tìm element có tên tương ứng trong danh sách
function findElementByName(elements, name) {
    return Array.from(elements).find(element => {
        const nodeName = element.querySelector('.klk-tree-node-title').textContent.trim();
        return nodeName === name;
    });
}

// ẩn checkbox được lựa chọn 
function hideCheckBox(checkInput, index) {
    if (checkInput) {
        checkInput.querySelector('.klk-checkbox-base').classList.remove('klk-checkbox-checked');
    }

    if (index >= 0 && index < ticket.length) {
        ticket.splice(index, 1);
        sessionStorage.setItem('ticket', JSON.stringify(ticket));
        // Render sau khi xóa.
        render(true);
    }
}




// ========================================================================= //
//  // CHON MUC CATOLOG TICKET
// ========================================================================= //
var ticketCatalog = [{ nameTicket: 'Công viên giải trí' }, { nameTicket: 'Công viên nước' }, { nameTicket: 'Bảo tàng' }, { nameTicket: 'Công viên & Vườn bách thảo' }, { nameTicket: 'Di tích lịch sử' }];
function renderForTicketCatalog(isRemove) {
    sessionStorage.setItem('ticketCatalog', JSON.stringify(ticketCatalog));
    let catalogItem = JSON.parse(sessionStorage.getItem('ticketCatalog')) ?? ticketCatalog;
    let itemList = document.querySelector('.klk-tree-node.catalog');
    // neu co remove thi xoa het va duyet lai tu dau 
    if (isRemove) {
        itemList.innerHTML = '';
    }
    // duyet lai phan tu chua trong categoryItem
    catalogItem.forEach((item, index) => {
        //xử lí cho phần chọn categoryItem
        let div = document.createElement('div');
        div.className = 'klk-tree-node-inner ';
        div.addEventListener('click', event => checkCatalog(index, event))
        div.innerHTML = `
            <span class="klk-checkbox klk-checkbox-normal ">
                <span class="klk-checkbox-base"><input type="checkbox" name="" class="checkbox" id="checkbox">
                <i class="fa-solid fa-check">
                    </i>
                </span>
            </span>
            <span class="klk-tree-node-title">${item.nameTicket}</span>
        `;
        itemList.appendChild(div);

    });
    render(true);
    renderIndex();
}

function checkCatalog(index, event) {
    event.stopPropagation();
    let countryOfSelect = document.querySelector(`.klk-tree-node.catalog`);
    let treeSetItem = countryOfSelect.querySelectorAll('.klk-tree-node-inner');
    let checkboxElement = treeSetItem[index].querySelector('.klk-checkbox-base');
    let nodeName = treeSetItem[index].querySelector('.klk-tree-node-title').textContent.trim();

    checkboxElement.classList.toggle('klk-checkbox-checked');
    isClickCheckbox(checkboxElement, nodeName);

}

// function isClickCatalog(checkboxElement, nodeName) {
//     if (checkboxElement.classList.contains('klk-checkbox-checked')) {
//         // Nếu có, thì thêm vào ticket
//         addSelectIntoTicket(nodeName);
//     } else {
//         // Nếu không, thì xóa khỏi ticket
//         const categoryItem = JSON.parse(sessionStorage.getItem('ticket')) || ticket;
//         const index = categoryItem.findIndex(item => item.name === nodeName);
//         deleteItem(index);
//     }
// }

renderForTicketCatalog();



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
                    <span class="klk-checkbox-base klk-checkbox-normal api">
                    <input type="checkbox" name="" id="">
                    <i class="fa-solid fa-check">
                    </i></span>
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
    console.log(index);
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
        toggleCheckInput(checkDTN.querySelector('.klk-checkbox-base'), event, true);
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
// const checkBoxes = document.querySelectorAll('.klk-tree-node-inner');
// checkBoxes.forEach(checkBox => {
//     checkBox.addEventListener('click', (event) => toggleCheckBox(checkBox, event));
// });

function toggleCheckBox(checkBox, event) {

    if (event.target.closest('.klk-tree-node.destination')) {
        return;
    }

    let checkboxElement = checkBox.querySelector('.klk-checkbox-base');
    let nodeName = checkBox.querySelector('.klk-tree-node-title').textContent.trim();

    // Toggle the class on the checkbox
    checkboxElement.classList.toggle('klk-checkbox-checked');
    isClickCheckbox(checkboxElement, nodeName);
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




