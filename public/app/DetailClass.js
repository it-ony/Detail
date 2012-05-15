define(
    ["js/core/Application", "js/data/Model", "flow"],
    function (Application, Model, flow) {

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

	            flow()
		            .seq(function(cb) {

			            // fetch shop
			            shop.fetch(null, cb);
			            console.log(0);

		            })
		            .seq(function(cb) {

			            // fethc productTypes
			            console.log('s', shop);
			            shop.$.productTypes.fetch(null, cb);
			            console.log(1);

	                })
		            .exec(function(err, res) {

			            console.log(err, shop);
			            self.start.baseImplementation.call(self, parameter, callback);

		            });

            }
        });
    }
);