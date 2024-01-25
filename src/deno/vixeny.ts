import vixeny from 'https://deno.land/x/endofunctor@v0.0.84/fun.ts';

Deno.serve(
	{
		port: 3000
	},

    vixeny({
    hasName: 'http://localhost:3000/'
})([
    {
        path: '/',
        type: 'response',
        r: () => new Response('Hi')
    },
    {
        path: '/id/:id',
        param: { unique:true },
        f: (f) => f.param
    },
    {
        path: '/query',
        query:{ unique: true, name: 'hello'},
        f: (f) => f.query ?? 'notFound' 
    },
    {
        path: '/token/:token',
        param: { unique:true },
        crypto:{ globalKey: new Uint8Array([...'yourSecretKey'])},
        options:{ remove:['token']},
        f: f => f.sign({token: f.param})
    },
])
)