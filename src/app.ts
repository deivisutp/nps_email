import 'reflect-metadata';
import express from 'express';
import './database';
import { router } from './routes';


const app = express();

/*
Get - Buscar
Post - Salvar
Put - Alterar
Delete - Deletar
Patch - Alteração especifica
*/

app.use(express.json());
app.use(router);

export { app };