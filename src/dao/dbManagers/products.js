import productsModel from "../models/products.js";

export default class Products{
    constructor(){
        console.log("Estamos trabajando con bd mongo");
    }

    getProducts = async () => {
        let products = await productsModel.find().lean()
        return products
    }

    getProductById = async (id) => {
        const products = await this.getProducts()

        const product = products.find(p => p._id == id)
        return(product)
    }

    addProduct = async product => {
        const products = await this.getProducts()

        const productoAgregado = products.find(p => p.code == product.code)
        if(productoAgregado) return error

        if(product.stock === 0) product.status = false

        let result = await productsModel.create(product)
        return result
    }

    updateProduct = async (pid, datosActualizados) => {
        const products = await this.getProducts()

        const keys = Object.keys(datosActualizados)
        const values = Object.values(datosActualizados)

        const product = products.find(p => p._id == pid)
        if(!product) return error


        if(keys.includes("id")){
            const indice = keys.indexOf("id")
            keys.splice(indice, 1)
            values.splice(indice, 1)
        }

        if(keys.includes("code")){
            const indice = keys.indexOf("code")
            const existsProduct = products.find(p => p.code == values[indice])
            if(existsProduct) return error
        }

        for(let i = 0; i < keys.length; i++){
            let llave = keys[i]
            let valor = values[i]
            product[llave] = valor
            await productsModel.updateOne({_id: pid}, product);
        }

        return product
    }

    deleteProduct = async pid => {
        const products = await this.getProducts()
        const product = products.find(p => p._id == pid)
        if(!product) return error

        await productsModel.deleteOne({_id: pid})
        return "Producto eliminado"
    }
}