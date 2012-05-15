define(
    ["js/core/Application", "js/data/Model"],
    function (Application, Model) {

        return Application.inherit({

            initialize:function () {
                this.set('shop', null);
            },
            /***
             * Starts the application
             * @param parameter
             * @param callback
             */
            start:function (parameter, callback) {

                var self = this,
                    shop = this.$.api.createModel(Model, parameter.shopId, "Shop");

                this.set('shop', shop);

                // fetch shop
                shop.fetch(null, function(err) {
                    if (err) {
                        callback(err);
                    } else {
                        self.start.baseImplementation.call(self, parameter, callback);
                    }
                });

            }
        });
    }
);