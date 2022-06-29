import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPen } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import axios from 'axios';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

import './App.css';

function App() {

  const listarClientesUrl = "https://localhost:44329/api/v1/Cliente/listar-clientes";
  const baseClientesUrl = "https://localhost:44329/api/v1/Cliente";
  const [data, setData] = useState([]);

  const [modalIncluir, setModalIncluir] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [exibirMensagem, setExibirMensagem] = useState({
    status: false,
    mensagem: ''
  });

  const [clienteSelecionado, setClienteSelecionado] = useState(false);

  const [cliente, setCliente] = useState({
    id: '',
    nome: '',
    cpf: '',
    dataNascimento: ''
  });

  const selecionarCliente = (cliente, opcao) => {
    setClienteSelecionado(cliente);
    (opcao == "Editar") && abrirFecharModalEditar();
  }

  const abrirFecharModal = () => {
    setModalIncluir(!modalIncluir);
  }

  const abrirFecharModalEditar = () => {
    setModalEditar(!modalEditar);
  }

  const handleChange = e => {
    const { name, value } = e.target;
    setCliente({
      ...cliente, [name]: value
    });
  }
  const handleChangeSelecionado = e => {
    const { name, value } = e.target;
    setClienteSelecionado({
      ...clienteSelecionado, [name]: value
    });
  }

  const clienteGet = async () => {
    await axios.get(listarClientesUrl)
      .then(responde => {
        setData(responde.data)
      }).catch(error => {
        console.log(error);
      });
  }

  const clientePost = async () => {
    delete cliente.id;
    await axios.post(baseClientesUrl, cliente)
      .then(response => {
        setData(data.concat(response.data));
        abrirFecharModal();
        setExibirMensagem({
          status: true,
          mensagem: "Cliente foi adicionado com sucesso!"
        });
      }).catch(error => {
        console.log(error);
      })
  }

  const clientePut = async () => {
    await axios.put(baseClientesUrl + "/" + clienteSelecionado.id, clienteSelecionado)
      .then(response => {
        var resposta = response.data;
        var dadosAuxiliar = data;
        dadosAuxiliar.map(cliente => {
          if (cliente.id === clienteSelecionado.id) {
            cliente.nome = resposta.nome;
            cliente.email = resposta.nome;
            cliente.idade = resposta.nome;
          }
        });
        abrirFecharModalEditar();
      }).catch(error => {
        console.log(error);
      })
  }

  const clienteExcluir = async () => {
    await axios.delete(baseClientesUrl + "/" + clienteSelecionado.id)
      .then(response => {
        setData(data.concat(response.data));
        abrirFecharModal();
        setExibirMensagem({
          status: true,
          mensagem: "Cliente excluído com sucesso!"
        });
      }).catch(error => {
        setExibirMensagem({
          status: true,
          mensagem: error.message
        });
        console.log(error);
      })
  }


  useEffect(() => {
    clienteGet();
  });

  return (
    <div className="App">
      <header className="App-header">
        <nav className="navbar navbar-dark navbar-expand-lg bg-dark ">
          <div className="container-fluid">
            <span className="navbar-brand">Sistema Locação</span>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <a className="nav-link active" aria-current="page" href="#">Cliente</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">Locação</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">Filmes</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
      <div className='container-fluid'>

        <h2 className='text-center my-5'>Clientes</h2>

        <div className='container'>

          {exibirMensagem.status ?
            <div className="alert alert-success" role="alert">
              {exibirMensagem.mensagem}
            </div> : null
          }

          <p>
            <a className="btn btn-info" asp-action="Adicionar" onClick={() => abrirFecharModal()}>Adicionar Cliente</a>
          </p>

          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Cpf</th>
                <th>Data de nascimento</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {data.map(cliente => (
                <tr key={cliente.id}>
                  <td>{cliente.nome}</td>
                  <td>{cliente.cpf}</td>
                  <td>{cliente.dataNascimento}</td>
                  <td>
                    <button className='btn btn-primary' onClick={() => selecionarCliente(cliente, "Editar")}><FontAwesomeIcon icon={faUserPen} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={modalIncluir}>
        <ModalHeader>Adicionar novo cliente</ModalHeader>
        <form>
          <ModalBody>
            <div className='form-group'>
              <div className="mb-3">
                <label className="form-label">Nome</label>
                <input type="text" className="form-control" name="nome" onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label for="cpf" className="form-label" >CPF</label>
                <input type="text" className="form-control" name="cpf" id="cpf" onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label for="dataNascimento" className="form-label">Data de nascimento</label>
                <input type="date" className="form-control" name="dataNascimento" id="dataNascimento" onChange={handleChange} required />
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <button className='btn btn-primary' onClick={() => clientePost()} type="submit">Adicionar</button>
            <button className='btn btn-danger' onClick={() => abrirFecharModal()}>Cancelar</button>
          </ModalFooter>
        </form>
      </Modal>

      <Modal isOpen={modalEditar}>
        <ModalHeader>Editar cliente</ModalHeader>
        <form>
          <ModalBody>
            <div className='form-group'>
              <div className="mb-3">
                <label className="form-label">Nome</label>
                <input type="text" className="form-control" name="nome" onChange={handleChangeSelecionado}
                  value={clienteSelecionado && clienteSelecionado.nome} />
              </div>
              <div className="mb-3">
                <label className="form-label" >CPF</label>
                <input type="text" className="form-control" name="cpf" id="cpf" onChange={handleChangeSelecionado}
                  value={clienteSelecionado && clienteSelecionado.cpf} />
              </div>
              <div className="mb-3">
                <label className="form-label">Data de nascimento</label>
                <input type="date" className="form-control" name="dataNascimento"
                  onChange={handleChangeSelecionado}
                  value={moment(clienteSelecionado.dataNascimento).format('yyyy-MM-DD')} />
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <button className='btn btn-primary' onClick={() => clientePut()} type="submit">Salvar</button>
            <button className='btn btn-danger' onClick={() => clienteExcluir()}>Excluir</button>
            <button className='btn btn-primary' onClick={() => abrirFecharModalEditar()}>Cancelar</button>
          </ModalFooter>
        </form>
      </Modal>
    </div >
  );
}

export default App;
