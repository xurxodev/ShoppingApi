
import * as boom from "@hapi/boom";
import * as hapi from "hapi";
import GetProductByAsinUseCase from "../../domain/products/usecases/GetProductByAsinUseCase";
import GetProductsUseCase from "../../domain/products/usecases/GetProductsUseCase";

export default class ProductController {

    private getProductsUseCase: GetProductsUseCase;
    private getProductByAsinUseCase: GetProductByAsinUseCase;

    constructor(
        getProductsUseCase: GetProductsUseCase,
        getProductByAsinUseCase: GetProductByAsinUseCase) {
        this.getProductsUseCase = getProductsUseCase;
        this.getProductByAsinUseCase = getProductByAsinUseCase;
    }

    public getProducts(request: hapi.Request, h: hapi.ResponseToolkit): hapi.Lifecycle.ReturnValue {
        let query = "";
        let page = 1;
        let category = "";

        if (request.query.q) {
            query = request.query.q.toString();
        }

        if (request.query.page) {
            page = +request.query.page;

            if (Number.isNaN(page) || page < 1 || page > 10) {
                return boom.badRequest("The value you specified for page is invalid. Valid values must be between 1 and 10");
            }
        }

        if (request.query.category) {
            category = request.query.category.toString();
        }

        return this.getProductsUseCase.execute(query, page, category);
    }

    public getProductById(request: hapi.Request, h: hapi.ResponseToolkit): hapi.Lifecycle.ReturnValue {
        if (request.params.asin) {
            return this.getProductByAsinUseCase.execute(request.params.asin)
                .catch(
                    (reason) => boom.notFound(reason.message)
                );
        }
    }
}
