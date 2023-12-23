
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
    let checkInputDes;
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

// ========================================================================= //
//  // DELETE iTEM BY INDEX OF CATAGORY
// ========================================================================= //

function deleteItem(index) {
    const indexOfTicket = ticket.findIndex(existingItem => existingItem.name === ticket[index].name);
    toggleCheckInputByIndex(indexOfTicket, index);

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
        div.className = 'klk-tree-node-inner  ';
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
        console.log(provincesVietNam);
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
    const desiredIndexesVietNam = [0, 49];
    const desiredIndexesThaiLand = [2, 3, 10, 5, 6];
    let desiredIndexes;

    if (country === 'vietnam') {
        desiredIndexes = desiredIndexesVietNam;
    } else {
        desiredIndexes = desiredIndexesThaiLand;
    }

    desiredIndexes.forEach((desiredIndex, i) => {
        const value = provinces[desiredIndex];

        if (value) {
            let div = document.createElement('div');
            div.className = 'klk-tree-sub klk-tree-node';
            div.style.paddingLeft = '32px';
            div.innerHTML = `
                <div class="klk-tree-node-inner child" onclick="checkRender(${i}, event, '${country}')">
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
        }
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

// ========================================================================= //
//  // ADD SELECTS INTO TICKET
// ========================================================================= //

function addSelectIntoTicket(name, isCities) {
    // chữa những tỉnh đã được lựa chọn 
    if(isCities){
        cities.push(name);
    }
   
    // Kiểm tra xem `name` đã tồn tại trong `ticket` hay chưa
    if (!isNameInTicket(name)) {
        ticket.push({ name: name });
        sessionStorage.setItem('ticket', JSON.stringify(ticket));
        render(true);
        filterTicketsByCategories(name);
    } else {
        console.log(`Tên '${name}' đã tồn tại trong ticket.`);
    }
}

// Hàm kiểm tra xem `name` đã tồn tại trong `ticket` hay chưa
function isNameInTicket(name) {
    return ticket.some(item => item.name === name);
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
        // checkAllOfDestination(country)
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
//  // CheckAll destination And DeleteAll Destination
// ========================================================================= //
function checkAllOfDestination(country) {
    let provincesVietNam = [];
    let provincesThaiLand = [];
    let tree = document.querySelector(`.klk-tree-node.main.destination.${country}`);
    let mainCheckbox = tree.querySelector('.klk-checkbox-base');
    // kiểm tra xem checkbox cha đã được chọn chưa 
    let checkTree = mainCheckbox.classList.contains('klk-checkbox-checked');

    let index = 0;

    let allChecked = true; // Giả sử tất cả checkbox đã được chọn
    let treeItems = tree.querySelectorAll('.klk-tree-sub.klk-tree-node');

    // const index = 0;
    treeItems.forEach((treeItem) => {
        let checkbox = treeItem.querySelector('.klk-checkbox-base');
        // lấy phần tử cha để phục vụ cho việc thêm, xóa tên checkbox 
        let treeNode = findAncestorWithClass(checkbox, 'klk-tree-node-inner');
        // lấy ra tên tỉnh của nước được chọn
        let nameNode = treeNode.querySelector('.klk-tree-node-title').textContent.trim()
        // chứa tên tỉnh 
        if (country == 'vietnam') {
            provincesVietNam.push(nameNode);
        } else {
            provincesThaiLand.push(nameNode);
        }
        //checkTree chưa được chọn
        if (!checkTree) {
            checkbox.classList.add('klk-checkbox-checked');
            // thêm vào lựa chọn
            if (country == 'vietnam') {
                addSelectIntoTicket(provincesVietNam[index]);
            } else {
                addSelectIntoTicket(provincesThaiLand[index]);
            }
            index++;
        }

        // Nếu có ít nhất một checkbox không chứa 'klk-checkbox-checked', đặt allChecked thành false
        if (!checkbox.classList.contains('klk-checkbox-checked')) {
            allChecked = false;
        }
        if (checkTree && allChecked) {
            checkbox.classList.remove('klk-checkbox-checked');
            //xóa đi lựa chọn
            if (country == 'vietnam') {
                deleteAllForDestination(provincesVietNam[index]);
            } else {
                deleteAllForDestination(provincesThaiLand[index]);
            }
            index++;
        }
    });

    // Nếu tất cả các checkbox đều đã được chọn, thì allChecked sẽ là true
    if (!allChecked) {
        // Nếu allChecked là false, thì set lại tất cả các checkbox không chứa 'klk-checkbox-checked'
        treeItems.forEach((treeItem) => {
            let checkbox = treeItem.querySelector('.klk-checkbox-base');
            if (!checkbox.classList.contains('klk-checkbox-checked')) {
                checkbox.classList.add('klk-checkbox-checked');
                let treeNode = findAncestorWithClass(checkbox, 'klk-tree-node-inner');
                if (country == 'vietnam') {
                    addSelectIntoTicket(provincesVietNam[index]);
                } else {
                    addSelectIntoTicket(provincesThaiLand[index]);
                }
                index++;
            }
        });
    }

    if (allChecked) {
        mainCheckbox.classList.toggle('klk-checkbox-checked');
    } else {
        // mainCheckbox.classList.remove('klk-checkbox-checked');
    }

}

function deleteAllForDestination(name) {
    if (isNameInTicket(name)) {
        ticket = ticket.filter(item => item.name !== name); // xóa đi tên
        sessionStorage.setItem('ticket', JSON.stringify(ticket));
        render(true);
    } else {
        console.log(`Tên '${name}' không tồn tại trong ticket.`);
    }
}


// ========================================================================= //
//  // CLEAR ALL SELECTION
// ========================================================================= //
const clearAll = document.querySelector('.clear-selection');
clearAll.addEventListener('click', (event) => getClearAllSelect(clearAll, event));

function getClearAllSelect() {

    let trees = document.querySelectorAll('.klk-tree.klk-tree-checkable.klk-tree-multiple');

    trees.forEach(tree => {
        ticket.splice(0, ticket.length); // Clear all elements in the array
        sessionStorage.setItem("ticket", JSON.stringify(ticket));

        let checkboxContainers = tree.querySelectorAll('.klk-checkbox-base.klk-checkbox-checked');
        checkboxContainers.forEach(container => {
            // Find the closest ancestor element with the class 'klk-tree-node'
            let treeNode = findAncestorWithClass(container, 'klk-tree-node-inner');
            // Check if a parent with the specified class was found
            if (treeNode) {
                hideCheckBox(treeNode, null);
            }
        });
    });
    render(true);
}

// Helper function to find the closest ancestor with a specific class
function findAncestorWithClass(element, className) {
    while ((element = element.parentElement) && !element.classList.contains(className));
    return element;
}

// ========================================================================= //
//  // PAGINATION
// ========================================================================= //
function getPageList(totalPages, page, maxLength) {
    function range(start, end) {
        return Array.from(Array(end - start + 1), (_, i) => i + start);
    }

    var sideWidth = maxLength < 9 ? 1 : 2;
    var leftWidth = (maxLength - sideWidth * 2 - 3) >> 1;
    var rightWidth = (maxLength - sideWidth * 2 - 3) >> 1;

    if (totalPages <= maxLength) {
        return range(1, totalPages);
    }

    if (page <= maxLength - sideWidth - 1 - rightWidth) {
        return range(1, maxLength - sideWidth - 1).concat(0, range(totalPages - sideWidth + 1, totalPages));
    }

    if (page >= totalPages - sideWidth - 1 - rightWidth) {
        return range(1, sideWidth).concat(0, range(totalPages - sideWidth - 1 - rightWidth - leftWidth, totalPages));
    }

    return range(1, sideWidth).concat(0, range(page - leftWidth, page + rightWidth), 0, range(totalPages - sideWidth + 1, totalPages));
}

$(function () {
    var numberOfItems = $(".search-result-activity-list .search-result-card").length;
    var limitPerPage = 9; //How many card items visible per a page
    var totalPages = Math.ceil(numberOfItems / limitPerPage);
    var paginationSize = 5; //How many page elements visible in the pagination
    var currentPage;

    function showPage(whichPage) {
        if (whichPage < 1 || whichPage > totalPages) return false;

        currentPage = whichPage;

        $(".search-result-activity-list .search-result-card").hide().slice((currentPage - 1) * limitPerPage, currentPage * limitPerPage).show();

        $(".pagination li").slice(1, -1).remove();

        getPageList(totalPages, currentPage, paginationSize).forEach(item => {
            $("<li>").addClass("page-item").addClass(item ? "current-page" : "dots")
                .toggleClass("active", item === currentPage).append($("<a>").addClass("page-link")
                    .attr({ href: "javascript:void(0)" }).text(item || "...")).insertBefore(".next-page");
        });

        $(".previous-page").toggleClass("disable", currentPage === 1);
        $(".next-page").toggleClass("disable", currentPage === totalPages);
        return true;
    }

    $(".pagination").append(
        $("<li>").addClass("page-item").addClass("previous-page").append($("<a>").addClass("page-link").attr({ href: "javascript:void(0)" }).text("Prev")),
        $("<li>").addClass("page-item").addClass("next-page").append($("<a>").addClass("page-link").attr({ href: "javascript:void(0)" }).text("Next"))
    );

    $(".card-content").show();
    showPage(1);

    $(document).on("click", ".pagination li.current-page:not(.active)", function () {
        return showPage(+$(this).text());
    });

    $(".next-page").on("click", function () {
        return showPage(currentPage + 1);
    });

    $(".previous-page").on("click", function () {
        return showPage(currentPage - 1);
    });
    $(".pagination").toggle(totalPages > 1); // Ẩn phân trang nếu totalPages bằng 1
});



// ========================================================================= //
//  // LIST PRODUCTS
// ========================================================================= //
class Ticket {
    constructor(province, nameOfTicket, nameOfCatalog, price, img) {
        this.province = province;
        this.nameOfTicket = nameOfTicket;

        this.nameOfCatalog = nameOfCatalog;
        this.price = price;
        this.img = img;
    }
}

class Country {
    constructor(name) {
        this.name = name;
        this.tickets = [];
    }

    addTicket(ticket) {
        this.tickets.push(ticket);
    }
}

class CountryList {
    constructor() {
        this.countries = [];
    }

    addCountry(country) {
        this.countries.push(country);
    }

    findCountryByName(name) {
        return this.countries.find(country => country.name === name);
    }

    // Các hàm khác có thể được thêm vào tùy theo nhu cầu
}

// Tạo vé cho Hồ Chí Minh
const hcmTicket1 = new Ticket('Thành phố Hồ Chí Minh', 'Vé Công Viên Văn Hóa Suối Tiên', 'Công viên giải trí', 150000, 'img1.jpg');
const hcmTicket2 = new Ticket('Thành phố Hồ Chí Minh', 'Vé Công viên Văn hóa Đầm Sen', 'Công viên giải trí', 200000, 'img2.jpg');
const hcmTicket3 = new Ticket('Thành phố Hồ Chí Minh', 'Vé Khu vui chơi giải trí Sài Gòn Outcast', 'Công viên giải trí', 200000, 'img3.jpg');
const hcmTicket4 = new Ticket('Thành phố Hồ Chí Minh', 'Vé Công viên nước Thiên Thanh', 'Công viên nước', 200000, 'img4.jpg');
const hcmTicket5 = new Ticket('Thành phố Hồ Chí Minh', 'Vé MAIA Pool', 'Công viên nước', 200000, 'img5.jpg');
const hcmTicket6 = new Ticket('Thành phố Hồ Chí Minh', 'Vé Công Viên Nước Củ Chi', 'Công viên nước', 100000, 'img6.jpg');
const hcmTicket7 = new Ticket('Thành phố Hồ Chí Minh', 'Vé Bảo Tàng Lịch Sử Việt Nam', 'Bảo tàng', 80000, 'img7.jpg');
const hcmTicket8 = new Ticket('Thành phố Hồ Chí Minh', 'Vé Bảo Tàng Y Học Việt Nam', 'Bảo tàng', 50000, 'img8.jpg');
const hcmTicket9 = new Ticket('Thành phố Hồ Chí Minh', 'Vé Bảo tàng Chứng Tích Chiến Tranh', 'Bảo tàng', 50000, 'img9.jpg');
const hcmTicket10 = new Ticket('Thành phố Hồ Chí Minh', 'Vé Thảo Cầm Viên', 'Công viên & Vườn bách thảo', 100000, 'img10.jpg');
const hcmTicket11 = new Ticket('Thành phố Hồ Chí Minh', 'Vé Dinh Độc Lập', 'Di tích lịch sử', 30000, 'img11.jpg');
const hcmTicket12 = new Ticket('Thành phố Hồ Chí Minh', 'Vé Địa đạo Củ Chi.', 'Di tích lịch sử', 100000, 'img12.jpg');

// Tạo vé cho Hà Nội
const hanoiTicket1 = new Ticket('Hà Nội', 'Vé Công Viên Hòa Bình', 'Công viên giải trí', 120000, 'img13.jpg');
const hanoiTicket2 = new Ticket('Hà Nội', 'Vé Khu vui chơi giải trí Hồ Tây', 'Công viên giải trí', 150000, 'img15.jpg');
const hanoiTicket3 = new Ticket('Hà Nội', 'Vé Công viên nước Hồ Gươm', 'Công viên nước', 120000, 'img19.jpg');
const hanoiTicket4 = new Ticket('Hà Nội', 'Vé Bảo tàng Quốc gia Việt Nam', 'Bảo tàng', 90000, 'img21.jpg');
const hanoiTicket5 = new Ticket('Hà Nội', 'Vé Bảo Tàng Dân Tộc Học Việt Nam', 'Bảo tàng', 80000, 'img14.jpg');
const hanoiTicket6 = new Ticket('Hà Nội', 'Vé Công viên & Vườn Bách Thảo', 'Công viên & Vườn bách thảo', 100000, 'img20.jpg');
const hanoiTicket7 = new Ticket('Hà Nội', 'Vé Quảng trường Ba Đình', 'Di tích lịch sử', 50000, 'img16.jpg');
const hanoiTicket8 = new Ticket('Hà Nội', 'Vé Lăng Chủ tịch Hồ Chí Minh', 'Di tích lịch sử', 40000, 'img17.jpg');
const hanoiTicket9 = new Ticket('Hà Nội', 'Vé Chùa Một Cột', 'Di tích lịch sử', 100.000, 'img');

// Tạo vé cho Đà Nẵng
const danangTicket1 = new Ticket('Đà Nẵng', 'Vé Công viên giải trí Asia Park', 'Công viên giải trí', 150000, 'img22.jpg');
const danangTicket2 = new Ticket('Đà Nẵng', 'Vé Công viên nước Helio Center', 'Công viên nước', 120000, 'img24.jpg');
const danangTicket3 = new Ticket('Đà Nẵng', 'Vé Vé Công Viên Nước Mikazuki 365 tại Đà Nẵng', 'Công viên nước', 90000, 'img28.jpg');
const danangTicket4 = new Ticket('Đà Nẵng', 'Vé Bảo tàng Di tích Lịch sử Đà Nẵng', 'Bảo tàng', 90000, 'img28.jpg');
const danangTicket5 = new Ticket('Đà Nẵng', 'Vé Bảo tàng Chăm', 'Bảo tàng', 70000, 'img23.jpg');
const danangTicket6 = new Ticket('Đà Nẵng', 'Vé Tham Quan Khu Du Lịch Cổng Trời Đông Giang', 'Công viên & Vườn bách thảo', 90000, 'img28.jpg');
const danangTicket7 = new Ticket('Đà Nẵng', 'Vé Ngũ Hành Sơn và Bảo tàng Ký ức Điêu khắc Đá Mỹ nghệ Non Nước', 'Công viên & Vườn bách thảo', 90000, 'img28.jpg');
const danangTicket8 = new Ticket('Đà Nẵng', 'Vé Vào Cổng Di Sản Văn Hoá Thánh Địa Mỹ Sơn', 'Di tích lịch sử', 90000, 'img28.jpg');

// Tạo vé cho Nha Trang
const nhatrangTicket1 = new Ticket('Nha Trang', 'Vé Vinpearl Land', 'Công viên giải trí', 200000, 'img15.jpg');
const nhatrangTicket2 = new Ticket('Nha Trang', 'Vé Tháp Po Nagar Cham', 'Di tích lịch sử', 50000, 'img16.jpg');
const nhatrangTicket3 = new Ticket('Nha Trang', 'Vé Nhà thờ Núi', 'Di tích lịch sử', 70000, 'img17.jpg');
const nhatrangTicket4 = new Ticket('Nha Trang', 'Vé Công viên nước Vinpearl Water Park', 'Công viên nước', 150000, 'img18.jpg');
const nhatrangTicket5 = new Ticket('Nha Trang', 'Vé Tham Quan Đảo Khỉ Nha Trang', 'Công viên & Vườn bách thảo', 150000, 'img18.jpg');
const nhatrangTicket6 = new Ticket('Nha Trang', 'Vé Vé Tham Quan Đảo Hoa Lan Tại Nha Trang', 'Công viên & Vườn bách thảo', 150000, 'img18.jpg');

const vietnam = new Country('Vietnam');

// Thêm vé cho Hồ Chí Minh
vietnam.addTicket(hcmTicket1);
vietnam.addTicket(hcmTicket2);
vietnam.addTicket(hcmTicket3);
vietnam.addTicket(hcmTicket4);
vietnam.addTicket(hcmTicket5);
vietnam.addTicket(hcmTicket6);
vietnam.addTicket(hcmTicket7);
vietnam.addTicket(hcmTicket8);
vietnam.addTicket(hcmTicket9);
vietnam.addTicket(hcmTicket10);
vietnam.addTicket(hcmTicket11);
vietnam.addTicket(hcmTicket12);

// Thêm vé cho Hà Nội
vietnam.addTicket(hanoiTicket1);
vietnam.addTicket(hanoiTicket2);
vietnam.addTicket(hanoiTicket3);
vietnam.addTicket(hanoiTicket4);
vietnam.addTicket(hanoiTicket5);
vietnam.addTicket(hanoiTicket6);
vietnam.addTicket(hanoiTicket7);
vietnam.addTicket(hanoiTicket8);
vietnam.addTicket(hanoiTicket9);

// Thêm vé cho Đà Nẵng
vietnam.addTicket(danangTicket1);
vietnam.addTicket(danangTicket2);
vietnam.addTicket(danangTicket3);
vietnam.addTicket(danangTicket4);
vietnam.addTicket(danangTicket5);
vietnam.addTicket(danangTicket6);
vietnam.addTicket(danangTicket7);
vietnam.addTicket(danangTicket8);

// Thêm vé cho Nha Trang
vietnam.addTicket(nhatrangTicket1);
vietnam.addTicket(nhatrangTicket2);
vietnam.addTicket(nhatrangTicket3);
vietnam.addTicket(nhatrangTicket4);
vietnam.addTicket(nhatrangTicket5);
vietnam.addTicket(nhatrangTicket6);

const countryList = new CountryList();
countryList.addCountry(vietnam);

const cities =[];

function pushSelectProduct() {
    // Lấy danh sách vé từ sessionStorage hoặc ticket
    let ticketList = JSON.parse(sessionStorage.getItem('ticket')) ?? ticket;

    // Mảng mới để lưu các phần tử đã chọn từ category
    let selectedProducts = [];

    // Duyệt qua từng phần tử trong category
    ticketList.forEach(categoryItem => {
        // Kiểm tra xem có phần tử có tên tương ứng trong danh sách vé không
        const matchingTicket = ticketList.find(ticket => ticket.nameOfCatalog === categoryItem);

        // Nếu không tồn tại, thêm vào mảng mới
        if (!matchingTicket) {
            selectedProducts.push(categoryItem);
        }
    });

    // In ra mảng mới chứa các phần tử đã chọn
    console.log(selectedProducts);
}


function filterTicketsByCity(cities) {
    // Lọc tất cả các vé có nameOfTicket là một trong các thành phố trong mảng cities
    const cityTickets = ticketList.filter(ticket => cities.includes(ticket.nameOfTicket));

    // Lọc tất cả các vé có nameOfCatalog là category1 hoặc category2
    const filteredTickets = cityTickets.filter(ticket => ticket.nameOfCatalog === category1 || ticket.nameOfCatalog === category2);

    return filteredTickets;
}


function filterTicketsByCategories() {
    let filteredTickets = [];
    let ticketList = JSON.parse(sessionStorage.getItem('ticket')) ?? ticket;

    // Sử dụng biến toàn cục countryList trực tiếp
    countryList.countries.forEach(country => {
        ticketList.forEach(select => {
            // Kiểm tra xem tên của vé có trùng với thành phố trong mảng cities không
            if (!cities.includes(select.nameOfTicket)) {
                country.tickets.forEach(ticket => {
                    // Kiểm tra điều kiện và thêm vé vào mảng nếu thỏa mãn
                    if (ticket.nameOfCatalog === select) {
                        filteredTickets.push(ticket);
                    }
                });
            }
        });
    });

   console.log(filteredTickets);
}


function renderListProducts(countryList) {
    const container = document.querySelector(".search-result-activity-list"); // Thay "product-container" bằng ID thích hợp trong HTML của bạn

    // Kiểm tra xem container có tồn tại không
    if (!container) {
        console.error("Container not found!");
        return;
    }

    // Duyệt qua các quốc gia trong danh sách
    countryList.countries.forEach(country => {
        // Duyệt qua các vé của mỗi quốc gia
        country.tickets.forEach(ticket => {
            const randomScore = (Math.random() * 0.8) + 4.2;
            const formattedScore = randomScore.toFixed(1); // Giữ một chữ số thập phân
            const randomReviewNumber = Math.floor(Math.random() * 500) + 1;
            // Tạo HTML string cho mỗi sản phẩm
            const productHTML = `
                <div class="search-result-card rwd-activity-card desktop large-card">
                    <div class="adaptive-card_wrap activity-card-background">
                        <div class="adaptive-card_link" style="padding-bottom: 56.25%;">
                            <img src="${ticket.img}" alt="" class="lazy-load-card__img">
                        </div>
                    </div>
                    <div class="activity-card_content large-card_content">
                        <div class="activity-card_content-top">
                            <div class="activity-card_content-title-section">
                                <div class="activity-card_content-top_title">
                                    <h3 class="activity-card-title desktop large-card">
                                        <a href="">${ticket.nameOfTicket}</a>
                                    </h3>
                                    <div
                                    class="page-activity-recommend-info-title-review activity-card_score is-big-card">

                                    <div class="page-activity-recommend-score">
                                        <span class="page-activity-recommend-score-number">
                                            <span class='i-icon bx bxs-star bx-flip-horizontal'></span>
                                            <span class="score-rate">${formattedScore}</span>
                                        </span>

                                        <span class="page-activity-recommend-review-number">
                                            <span class="review-number">${randomReviewNumber}</span>
                                        </span>

                                        <i class="sep"></i>
                                        <span class="page-activity-recommend-booked-number">20K+ Đã được
                                            đặt</span>
                                    </div>
                                    <div class="tagging-wrap activity-card_property middle-style">
                                    <div class="tagging-box">
                                        <div class="tagging-tag middle-style">
                                            <div class="klk-poptip klk-poptip-dark">
                                                <div class="klk-poptip-reference">
                                                    <div class="tagging-tag_custom js-tag-body-node" style="color: rgb(117, 117, 117);
                                                    border-color: rgb(245, 245, 245);
                                                    background-color: rgb(245, 245, 245);
                                                    border-radius: 6px;">
                                                        <span class="tagging-tag_text">
                                                            Xác nhận tức
                                                            thời
                                                            <span class="js-tag-content-node"></span>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- <div class="tagging-tag middle-style">
                                            <div class="klk-poptip klk-poptip-dark">
                                                <div class="klk-poptip-reference">
                                                    <div class="tagging-tag_custom js-tag-body-node"></div>
                                                </div>
                                            </div>
                                        </div> -->
                                    </div>
                                </div>
                                </div>
                                </div>
                            </div>
                        </div>
                        <div class="price-item">
                            <h4>đ ${ticket.price.toLocaleString('en-US')}</h4>
                        </div>
                        <div class="policy">
                            <div>
                                <p>Ưu đãi đặc biệt cho trẻ em</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Chèn sản phẩm vào container
            container.innerHTML += productHTML;
        });
    });
}

// Sử dụng:
renderListProducts(countryList);


