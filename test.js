const listItems = [
    { type: 'h3', text: 'Mis compras' },
    { type: 'a', text: 'Favoritos' },
    { type: 'a', text: 'Pedidos' }
];

let currentCategoryGrp = null;

listItems.forEach((li) => {
    if (li.type === 'h3') {
        currentCategoryGrp = [];
        li.categoryChildren = currentCategoryGrp;
    } else {
        if (currentCategoryGrp !== null) {
            currentCategoryGrp.push(li);
        }
    }
});
console.log(listItems[0].categoryChildren); // Deberia imprimir favoritos y pedidos
