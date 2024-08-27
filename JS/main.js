document.addEventListener("DOMContentLoaded", () => {
    if (document.location.pathname.includes("registrar")) {
        registrarUsuario()
    } else if (document.location.pathname.includes("iniciarsesion")) {
        iniciarSesion()
    } else if (document.location.pathname.includes("inicio"))
    agregarSource()
    cargarSaludo()
    cargarSources()
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
                        localStorage.setItem("UsuarioId",usuario.id)
                        localStorage.setItem("nombreUser", usuario.nombre)
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

const cargarSaludo = () => {
    const nombre = localStorage.getItem("nombreUser")
    document.getElementById("nombre").textContent = `¡Bienvenido de nuevo ${nombre}!`
}

const agregarSource = async () => {
    const boton = document.querySelector(".botonAdd")
    const user = localStorage.getItem("UsuarioId")
    console.log(user)
    const oscurecer = document.querySelector(".oscurecer")

    try {
        const respuesta = await fetch("https://66c822da732bf1b79fa84d56.mockapi.io/api/v1/resources")
        if (respuesta.ok) {
            boton.addEventListener("click", () => {
                var formulario = document.querySelector(".formularioAgregarSource")
                formulario.style.display = "block"
                oscurecer.classList.add("activo")
        })

        const guardar = document.getElementById("guardar")
        const quitar = document.getElementById("cancelar")
        guardar.addEventListener("click", async() =>{
            const nombre = document.getElementById("nombreRecurso").value
            const genero = Array.from(document.getElementById("generoRecurso").selectedOptions).map(option => option.value)
            const plataforma = document.getElementById("plataformaRecurso").value
            const estado = document.getElementById("estadoRecurso").value
            const formato = document.getElementById("formatoRecurso").value
            const fecha = document.getElementById("fechaRecurso").value
            const calificacion = document.querySelector("input[name='rate']:checked")?.value|| 0
            const resena = document.getElementById("resena").value
            let id = 1
            console.log(calificacion)
            console.log(estado)

            if(!nombre || genero.length == 0 || plataforma.length == 0 || estado.length == 0 || formato.length == 0 || !resena){
                alert("Llena todos los campos")
                return
            } else if (estado !== "Terminado") {
                alert("No puedes ingresar una fecha si el estado no es 'Terminado'");
                document.getElementById('fechaRecurso').value = ''
                document.getElementById('estadoRecurso').value = ''
                return;
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
                source.id = id
                console.log(source)
                id++


                const obtenerUsuario = await fetch(`https://66c822da732bf1b79fa84d56.mockapi.io/api/v1/resources/${user}`)
                if (!obtenerUsuario.ok) {
                    throw new Error("Error accediendo al usuario");
                }
                const usuario = await obtenerUsuario.json();
                console.log(usuario)
                usuario.sources.push(source)
                
                const cargaRecurso  = await fetch(`https://66c822da732bf1b79fa84d56.mockapi.io/api/v1/resources/${user}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(usuario)
                });
                if (!cargaRecurso.ok) {
                    throw new Error("Error al cargar el recurso");
                }
                cargarSources()
                formulario.style.display = "none"
        }})
    } else {
        console.error("Error accediendo a la base de datos")
    }
    } catch (error) {
        console.error("Error:", error.message);
    }
}

const cargarSources = async () =>{
    const user = localStorage.getItem("UsuarioId")
    const data = await fetch (`https://66c822da732bf1b79fa84d56.mockapi.io/api/v1/resources/${user}`)
    try {
        userInfo = await data.json()
        sourcesUser = userInfo.sources
        const recursos = document.querySelector(".recursos")
        recursos.innerHTML = '';
        console.log(sourcesUser)
        sourcesUser.forEach(source => {
            const generos = source.genero.join(" ,");
            const info = `<li class= "recurso">
            <h2 id = "nombreSource">${source.nombre}</h2>
            <p id = "genero"><span>Géneros: </span>${generos}</p>
            <p id = "plataforma"><span>Plataforma: </span>${source.plataforma}</p>
            <p id = "estado"><span>Estado: </span>${source.estado}</p>
            <p id = "formato"><span>Formato: </span>${source.formato}</p>
            <p id = "fecha"><span>Finalización: </span>${source.fecha}</p>
            <p id = "calificacion"><span>Calificación: </span>${source.calificacion} estrellas</p>
            <p id = "resena"><span>Reseña: </span>${source.resena}</p>
            <div class="btn">
            <button id = "eliminar"><img src= "../assets/eliminar.svg" alt= "eliminar"></button>
            <button id = "actualizar"><img src= "../assets/actualizar.svg" alt= "actualizar"></button>
            </div>
            </li>`
            recursos.innerHTML+= info
        });
    } catch (error) {
        console.error(error)
    }
}