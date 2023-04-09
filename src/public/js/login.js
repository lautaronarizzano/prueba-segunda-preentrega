const form = document.getElementById('loginForm')

form.addEventListener('submit', async e => {
    e.preventDefault()
    console.log('hola')

    // const data  = new FormData(form)
    // const obj = {}

    // data.forEach((value, key) => obj[key] = value)

    // fetch('/api/sessions/login', {
    //     method: 'POST',
    //     body: JSON.stringify(obj),
    //     headers: {
    //         'Content-Type': 'application/json'
    //     }
    // }).then(result => {
    //     if(result.status === 200) {
    //         window.location.replace('/products')
    //     }
    // })

    const datos = {
        email: form[0].value,
        password: form[1].value,
    }

    const respuesta = await fetch('/api/sessions/login', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    });

    console.log(respuesta)

    if(respuesta.status === 200) {
        console.log(document.cookie)
    }  else {
        location.href = "/login"
    }
})