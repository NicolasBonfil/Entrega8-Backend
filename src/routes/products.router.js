import { Router } from "express"
import ProductManager from "../dao/dbManagers/products.js"
import productsModel from "../dao/models/products.js"

const router = Router()

const manejadorProductos = new ProductManager()

router.get("/", async (req, res) => {
    const {limit = 10} = req.query
    const {page = 1} = req.query

    try {
        let filtro = {};
    
        if(req.query.status == "true"){
            filtro = {status: true}
        }else if(req.query.status == "false"){
            filtro = {status: false}
        }else if(req.query.category){
            filtro = {category: req.query.category}
        }
    
        const {totalPages, docs, hasPrevPage, hasNextPage, nextPage, prevPage} = await productsModel.paginate(filtro, {limit, page, lean: true})
        
        let products = docs
    
        if(req.query.sort == "asc"){
            products = await productsModel.find().sort({price: 1})
        }else if(req.query.sort == "desc"){
            products = await productsModel.find().sort({price: -1})
        }
    
        let prevLink
        hasPrevPage? prevLink = prevLink = `http://localhost:8080/products?page=${prevPage}` : null
        
        let nextLink
        hasNextPage? nextLink = nextLink = `http://localhost:8080/products?page=${nextPage}` : null
    
        res.status(400).send({payload: products, totalPages, page, hasPrevPage, hasNextPage, nextPage, prevPage, prevLink, nextLink})
    } catch (error) {
        res.status(200)
        console.log(error)
    }
})

router.get("/:id", async (req, res) => {
    const id = req.params.id
    try {
        const product = await manejadorProductos.getProductById(id)
        res.status(400).send({payload: product})    
    } catch {
        const products = await this.getProducts()
        const existsProduct = products.find(p => p._id == id)
        if(!existsProduct) return ({status: "error", error: "No existe un producto con ese id"})
    }

})

router.post("/", async (req, res) => {
    const {title, description, price, code, stock, category, thumbnail} = req.body

    try {
        let product = {
            title,
            description,
            price,
            code,
            stock,
            category,
            thumbnail
        }
    
        const newProduct = await manejadorProductos.addProduct(product)
        res.status(400).send({payload: newProduct})
    } catch {
        if(!title || !description || !price || !code || !category){
            res.status(400).send({status: "error", error: "Faltan datoss"})
        }

        const products = await manejadorProductos.getProducts()
        const productoAgregado = products.find(p => p.code == code)
        if(productoAgregado) res.status(400).send({status: "error", error: "El producto ya esta registrado"})
    }


})

router.put("/:pid", async (req, res) => {
    const pid = req.params.pid
    const datosActualizados = req.body

    try {
        const productoActualizado = await manejadorProductos.updateProduct(pid, datosActualizados)
        res.status(200).send({payload: productoActualizado})
    } catch {
        if(!pid) return res.status(400).send({status: "error", error: "Faltan datos"})

        const products = await manejadorProductos.getProducts()

        const existsProduct = products.find(p => p.code == datosActualizados.code)
        if(existsProduct) res.status(400).send({status: "error", error: "Ya existe un producto con ese codigo"})

        const product = products.find(p => p._id == pid)
        if(!product) return res.status(400).send({status: "error", error: "No existe un producto con ese id"})
    }
})

router.delete("/:pid", async (req, res) => {
    const pid = req.params.pid
    try {
        const productoEliminado = await manejadorProductos.deleteProduct(pid)
        res.status(200).send(productoEliminado)
        
    } catch {
        if(!pid) return res.status(400).send({status: "error", error: "Faltan datos"})

        const products = await manejadorProductos.getProducts()
        const product = products.find(p => p._id == pid)
        if(!product) return res.status(400).send({status: "error", error: "No existe un producto con ese id"})
    }

})

export default router