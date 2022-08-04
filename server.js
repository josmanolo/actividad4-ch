const express = require('express');
const { Router } = express;

const app = express();
const router = Router();
const formRouter = Router();
const PORT = 8080;

app.use(express.urlencoded({
    extended: true
}))
app.use(express.json());
app.use(express.static(__dirname + 'public'))


let productsList = [
    {
        title: "Product 1",
        price: 23444,
        thumbnail: "url",
        id: 1
    },
    {
        title: "Product 2",
        price: 23444,
        thumbnail: "url",
        id: 2
    },
    {
        title: "Product 3",
        price: 23444,
        thumbnail: "url",
        id: 3
    },
    {
        title: "Product 4",
        price: 23444,
        thumbnail: "url",
        id: 4
    },
];

router.post('/', (req, res) => {
    const { body } = req;
    const productsLength = productsList.length;

    const newProduct = {...body, id: productsList[productsLength - 1].id + 1 }
    productsList.push(newProduct);

    res.json({
        msg: `${body.title} agregado`,
    })
})

router.get('/', (req, res) => {
    res.json(productsList);
});

router.get('/:id', (req, res) => {
    const { params: { id } } = req;
    const findProduct = productsList.find(prod => prod.id === id);

    if(!findProduct) return res.json({error: "producto no encontrado"})
    res.json(findProduct);
})

router.put('/:id', (req, res) => {
    const { params: { id }, body: { title, price, thumbnail } } = req;

    const productIndex = productsList.findIndex(prod => prod.id === id);
    if(productIndex === -1) return res.json({error: "producto no encontrado"})

    const { title: titleCurrent, price: priceCurrent, thumbnail: thumbnailCurrent } = productsList[productIndex];
    productsList[productIndex] = {
        title: title || titleCurrent,
        price: price || priceCurrent,
        thumbnail: thumbnail || thumbnailCurrent,
        id
    }

    res.json({
         msg: `Producto ${id} actualizado`,
         product: productsList[productIndex],
    })

})

router.delete('/:id', (req, res) => {
    const { params: { id } } = req;
    const findProduct = productsList.find(prod => prod.id == id);

    if(findProduct) {
        const newProducts = productsList.filter(product => product.id != id);
        productsList = newProducts

        res.json({
            msg: `Producto ${id} borrado`,
            products: productsList
        }) 

    } else {
        res.json({error: "producto no encontrado"})
    }
})

formRouter.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
})

app.use('/api/products', router);
app.use('/form', formRouter);

app.listen(PORT, (err) => {
    if(err) throw err;
    console.log(`Server running on port ${PORT}`);
})