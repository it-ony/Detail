define(["js/core/Application", "js/data/Model", "flow", "sprd/model/Product", "sprd/model/Shop"],
    function (Application, Model, flow, Product, Shop) {

        return Application.inherit({

            initialize: function () {

                var self = this;

                this.set('shop', null);
                this.set('selectedProductType', null);
                this.set('selectedSize', null);
                this.set('selectedColor', null);
                this.set('product', new Product());
                this.set('currentView', null);

                this.bind('change:selectedProductType', function (evt) {
                    if (evt.$) {
//                        self.$.colorSelector.set('productType', null);
//                        self.$.sizeSelector.set('productType', null);
//                        self.$.product.set('productType', evt.$);

                        evt.$.fetch(null, function (err, productType) {
                            if (!err) {
//                                self.$.colorSelector.set('productType', productType);
//                                self.$.sizeSelector.set('productType', productType);
//                                self.set('currentView', productType.$.views.at(0));
                            }
                        });
                    }
                });

                this.bind('change:selectedColor', function (evt) {
                    self.$.product.set('appearance', evt.$);
                });

            },

            /***
             * Starts the application
             * @param parameter
             * @param callback
             */
            start: function (parameter, callback) {

                var self = this,
                    shop = this.$.api.createEntity(Shop, parameter.shopId);

                this.set('shop', shop);

                flow()
                    .seq(function (cb) {
                        // fetch shop
                        shop.fetch(null, cb);
                    })
                    .seq(function (cb) {
                        self.$.productTypePage.showPage(0, cb);
                    })
                    .exec(function (err, res) {

                        console.log(err, shop);
                        self.start.baseImplementation.call(self, parameter, callback);

                    });

            },

            nextPage: function () {
                this.$.productTypePage.nextPage();
            },

            prevPage: function () {
                this.$.productTypePage.previousPage();
            }
        });
    }
);