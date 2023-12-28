function getInfor(num) {
    const hotelItem = document.querySelector(`.js-hotel-item[data-='${num}']`);

    if (hotelItem) {
            // Lấy giá trị của thuộc tính data-*
            const hotelData = hotelItem.getAttribute('data-');

            // Lấy ra các phần tử con cụ thể trong hotel item
            const starElement = hotelItem.querySelector('.hotel-picture img');
            const headerElement = hotelItem.querySelector('.header');

            updateModal(starElement,headerElement);
    }
}

function updateModal(starElement,headerElement){
    const modalRoomElement = document.querySelector('.modal-room img');
    const nameRoomElement = document.querySelector('.name-room');

    // Gán nội dung mới cho modal
    modalRoomElement.src = starElement.src; // Gán ảnh từ hotel-picture
    nameRoomElement.textContent = headerElement.textContent; // Gán tên từ header
}
