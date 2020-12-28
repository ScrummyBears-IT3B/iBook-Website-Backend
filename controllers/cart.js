module.exports = function Cart(oldCart) {
    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;

    this.add = function(item, id) {
        var storedItem = this.items[id];
        if (!storedItem) {
            storedItem = this.items[id] = {item:item, qty: 0, BOOK_PRICE:0};
        }
        storedItem.qty++;
        storedItem.BOOK_PRICE = storedItem.item.BOOK_PRICE * storedItem.qty;
        this.totalQty++;
        this.totalPrice += storedItem.item.BOOK_PRICE;
    } 

    this.reduceByOne = function(id) {
        this.items[id].qty--;
        this.items[id].BOOK_PRICE -= this.items[id].item.BOOK_PRICE;
        this.totalQty--;
        this.totalPrice -= this.items[id].item.BOOK_PRICE;
    
        if (this.items[id].qty <= 0) {
            delete this.items[id];
        }
   
    }

    this.addByOne = function(id) {
        this.items[id].qty++;
        this.items[id].BOOK_PRICE += this.items[id].item.BOOK_PRICE;
        this.totalQty++;
        this.totalPrice += this.items[id].item.BOOK_PRICE;
    
        if (this.items[id].qty <= 0) {
            delete this.items[id];
        }
   
    }

    this.removeItem = function(id) {
        this.totalQty -= this.items[id].qty;
        this.totalPrice -= this.items[id].BOOK_PRICE;
        delete this.items[id];
    }

    

    this.generateArray = function() {
        var arr = [];
        for (var id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    };
}