define(["js/core/Application", "js/data/Model", "flow", "sprd/model/Product", "sprd/model/Shop", "sprd/entity/DesignConfiguration"],
    function (Application, Model, flow, Product, Shop, DesignConfiguration) {

        return Application.inherit({

            ctor: function() {
                this.callBase();
            },

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
                        self.$.colorSelector.set('productType', null);
                        self.$.sizeSelector.set('productType', null);
                        evt.$.fetch(null, function (err, productType) {
                            if (!err) {
                                self.$.product.set('productType', productType);
                                self.$.colorSelector.set('productType', productType);
                                self.$.sizeSelector.set('productType', productType);
                                self.set('currentView', productType.get('views[0]'));
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
                    .seq(function(){
                        if (shop.$.productTypes.size() > 0) {
                            self.set('selectedProductType', shop.$.productTypes.at(0));
                        }
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
            },

            addConfiguration: function() {

                var img = this.$systemManager.$document.createElement('img'),
                    self = this;

                img.onload = function() {
                    console.log(this.width, this.height);

                    if (self.$.currentView) {
                        var targetPrintArea = self.$.currentView.getDefaultPrintArea();
                        if (targetPrintArea) {
                            var configuration = new DesignConfiguration();

                            configuration.$.width = this.width;
                            configuration.$.height = this.height;
                            configuration.printArea = targetPrintArea;
                            configuration.$.url = img.src;

                            self.get('product.configurations').add(configuration)
                        }
                    }



                };

                img.src = this.$systemManager.$parameter.designUrl;


            }
        });
    }
);