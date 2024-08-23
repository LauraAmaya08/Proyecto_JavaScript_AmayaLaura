document.addEventListener("DOMContentLoaded", () => {
    if (document.location.pathname.includes("registrar")) {
        registrarUsuario()
    } else if (document.location.pathname.includes("iniciarsesion")) {
        iniciarSesion()
    } else if (document.location.pathname.includes("inicio"))
    agregarSource()
})

const registrarUsuario = () => {
    document.getElementById("registroForm").addEventListener("submit", async function (evento) {
        evento.preventDefault()
        const nombre = document.getElementById("usuarioNombre").value
        const email = document.getElementById("usuarioEmail").value
        const password = document.getElementById("usuarioContra").value
        try {
            const respuesta = await fetch("https://66c822da732bf1b79fa84d56.mockapi.io/api/v1/resources")
            const usuarios = await respuesta.json()
            if (respuesta.ok) {
                if (usuarios.some(usuario => usuario.email === email)) {
                    alert("El email ya se encuentra en nuestra base de datos, debes ingresar otro.")
                } else {
                    const nuevoUsuario = {
                        email: email,
                        nombre: nombre,
                        password: password,
                        sources: []
                    }
                    const respuestaRegistro = await fetch("https://66c822da732bf1b79fa84d56.mockapi.io/api/v1/resources", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(nuevoUsuario)
                    });

                    if (respuestaRegistro.ok) {
                        alert("Usuario agregado exitosamente")
                    } else {
                        alert("problema agregando el usuario")
                        const errorDatos = await respuestaRegistro.text();
                        console.error('Error al agregar el usuario:', errorDatos);
                    }
                }
            } else {
                throw new Error("Error al acceder a la base de datos")
            }
        } catch (error) {
            console.error(error)
        }

    })
}

const iniciarSesion = () => {
    document.getElementById("iniciarForm").addEventListener("submit", async function (evento) {
        evento.preventDefault()
        const email = document.getElementById("usuarioEmail").value
        const password = document.getElementById("usuarioContra").value
        try {
            const respuesta = await fetch("https://66c822da732bf1b79fa84d56.mockapi.io/api/v1/resources")
            const usuarios = await respuesta.json()
            if (respuesta.ok) {
                let usuario = usuarios.find(usuario => usuario.email === email)
                if (usuario) {
                    if (usuario.password !== password) {
                        alert("contraseña incorrecta")
                    } else {
                        alert("Hola de nuevo " + usuario.nombre)
                        window.location.href = "inicio.html"
                    }

                } else {
                    alert("usuario no encontrado")
                }
            } else {
                throw new Error("Error al acceder a la base de datos")
            }
        } catch (error) {
            console.error(error)
        }

    })
}

const agregarSource = async () => {
    const boton = document.querySelector(".botonAdd")
    try {
        const respuesta = await fetch("https://66c822da732bf1b79fa84d56.mockapi.io/api/v1/resources")
        if (respuesta.ok) {
            boton.addEventListener("click", () => {
                const formulario = document.querySelector(".formularioAgregarSource")
                formulario.style.display = "block"
        })
        const guardar = document.getElementById("guardar")
        guardar.addEventListener("click", async() =>{
            const nombre = document.getElementById("nombreRecurso").value
            const genero = Array.from(document.getElementById("generoRecurso").selectedOptions).map(option => option.value)
            const plataforma = document.getElementById("plataformaRecurso").value
            const estado = document.getElementById("estadoRecurso").value
            const formato = document.getElementById("formatoRecurso").value
            const fecha = document.getElementById("fechaRecurso").value
            const calificacion = document.querySelector("input[name='rate']:checked")?.value|| 0
            const resena = document.getElementById("resena").value
            console.log(calificacion)

            if(!nombre || genero.length == 0 || plataforma.length == 0 || estado.length == 0 || formato.length == 0 || !fecha || !resena){
                alert("Llena todos los campos")
            }
            else{
                let source = {}
                source.nombre = nombre
                source.genero = genero
                source.plataforma = plataforma
                source.estado = estado
                source.formato = formato
                source.fecha = fecha
                source.calificacion = calificacion
                source.resena = resena
                console.log(source)

                const respuestaAgregar = await fetch("https://66c822da732bf1b79fa84d56.mockapi.io/api/v1/resources", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
            })
            if (respuestaAgregar.ok){
                console.log(respuestaAgregar.json())
            }

        }})
    } else {
        console.error("Error accediendo a la base de datos")
    }
    } catch (error) {
        
    }
}