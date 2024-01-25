import fun from 'vixeny/fun'

export default {
    port: 3000,
	fetch: fun({
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
		// {
        //     path: '/cycle/:token',
        //     param: { unique:true },
        //     crypto:{ globalKey: new Uint8Array([...'yourSecretKey'])},
        //     options:{ remove:['token']},
        //     f: f => f.verify(f.sign({token: f.param}))?.token as string ?? 'NotFound'
        // },
	])
}