import Phoenix from 'phoenix';

Phoenix.createRouter({
    '/': {
        name: 'root',
        component ( resolve ){
            require(['./views/index.vue'], resolve);
        }
    }	
});	

	

    







	


















