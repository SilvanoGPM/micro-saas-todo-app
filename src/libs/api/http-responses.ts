import { NextResponse } from 'next/server';

function respond(data: unknown, status: number) {
  return NextResponse.json(data, { status });
}

function ok(data: unknown) {
  return respond(data, 200);
}

function created(data: unknown) {
  return respond(data, 201);
}

function noContent() {
  return respond(undefined, 204);
}

function badRequest(message = 'Requisição inválida.') {
  return respond({ error: message }, 400);
}

function unauthorized(message = 'Usuário não autorizado.') {
  return respond({ error: message, authenticated: false }, 401);
}

function forbidden(message = 'Acesso proibido.') {
  return respond({ error: message }, 403);
}

function notFound(message = 'Registro não encontrado.') {
  return respond({ error: message }, 404);
}

function serverError(message = 'Erro interno do servidor.') {
  return respond({ error: message }, 500);
}

export const httpResponses = {
  respond,
  ok,
  created,
  noContent,
  badRequest,
  notFound,
  unauthorized,
  forbidden,
  serverError,
};
