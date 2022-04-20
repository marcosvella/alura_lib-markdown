# Backup freeRADIUS

Para evitar problemas com a máquina do IXC, foi criado uma docker Image funcional com um banco do IXC para autenticar os clientes em caso de problema.

O container pode ser rodado em qualquer máquina que possua Docker. Serão aceitas conexões dos seguintes concentradores:

| Concentrador       | IP         | Secret         |
| ------------------ | ---------- | -------------- |
| ASR9K              | 10.33.0.10 | asr9knm288     |
| BRAS00_VOIP        | 10.33.0.14 | bras00nm288    |
| BRAS01_DIVERSOS    | 10.33.0.30 | bras01nm288    |
| rede_interna       | 10.0.30.1  | redeinterna288 |
| host (Docker host) | 172.17.0.1 | testeradius288 |

---

## Entrar no docker

<br>

### Docker Desktop:

Caso possua Docker Desktop, faça o login utilizando as credenciais abaixo.
**Login**: nmultifibra
**Password**: @NmultiDOCKER5

<br>

### CLI

```
docker login -u nmultifibra
Enter Passowrd: @NmultiDOCKER5
```

<br>
  
## Baixar imagem e rodar container

```
docker pull nmultifibra/nmt:freeradius

docker run -p 1812:1812/udp -p 1813:1813/udp -it --name nm-freeradius nmultifibra/nmt:freeradius
```

<br>

## Acessar container e executar serviços:

```
service mysql start
service freeradius start

cd /home/update-freeradius
./init.sh
```

---

<br>

## Testando backup:

Após ter subido o container e iniciado os serviços, o servidor freeRADIUS já deve estar rodando. É possível testar de 2 maneiras:

- NTRadPing Test Utility https://community.microfocus.com/cfs-file/__key/communityserver-wikis-components-files/00-00-00-01-70/ntradping.zip

- Teste dentro do Container

<br>

### NTRadPing

O recomendado é utilizar o **NTRadPing** (Windows), pois ele mostrará todos os parâmetros que o server está respondendo.

![Google](https://google.com.br)

<br>

### Teste dentro do Container

Acesseo container com o comando e execute o teste:

```
docker exec -it nm-freeradius /bin/bash
radtest {username} {password} localhost 10 testeradius288
```

Esse teste comprova o funcionamento do freeRADIUS, mas é um teste local. Pode haver problemas no mapeamento de portas internas do container com portas externas do host.

<br>

---

## Como adicionar um novo concentrador ou alterar o IP de um existente?

Dentro do diretório do freeRADIUS há um arquivo de configuração que permite criar a entrada de num novo cliente (concentrador).

Acesse o container e edite o seguinte arquivo

```
docker exec -it nm-freeradius /bin/bash
nano /etc/freeradius/3.0/clients.conf
```

Você vai notar que há estrturas desse tipo no arquivo

```
client asr9k {
        ipaddr = 10.33.0.10
        protocol = *
        secret = asr9knm288
        nas_type = cisco
        #limit {
        #       max_connections = 0
        #       lifetime = 0
        #       idle_timeout = 30
        #}
        require_message_authenticator = no
}
```

Para permitir um novo concentrador, basta criar um novo objeto como esse. Utilize esse como exemplo e substitua apenas o necessário:

```
client {NOME} {
        ipaddr = {IP}
        protocol = *
        secret = {SECRET}
        nas_type = cisco
        #limit {
        #       max_connections = 0
        #       lifetime = 0
        #       idle_timeout = 30
        #}
        require_message_authenticator = no
}
```

**OBS**: O atributo nas_type deve ser preenchido como "cisco" para concentradores Cisco ou "other" para outros tipos, como MikroTik ou computadores.

Salve o arquivo e execute:

```
service freeradius restart
```

Se o retorno desse comando for **[ OK ]**, tudo deu certo. O novo concentrador já deve conseguir acessar.

<br>

---

## DEBUG

Caso ainda sim não esteja funcionando, o freeRADIUS tem uma ferramenta de debug. Para ativá-la, é necessario acessar o container e rodar os seguintes comandos:

```shell
docker exec -it nm-freeradius /bin/bash

# Encerra o serviço atual do freeRADIUS
killall freeradius

# Ativa instância de DEBUG
freeradius -X
```

Se tudo der certo, o output deve ser esse:

![Facebook](https://facebook.com)

Toda requisição será capturada pelo debug. Caso algum erro ocorra, o output será vermelho. Na maioria dos casos é fácil de entender. Qualquer dúvida, copie e jogue no google
