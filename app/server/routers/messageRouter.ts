import type { Message } from '@prisma/client';
import { observable } from '@trpc/server/observable';
import { EventEmitter } from 'events';
import { prisma } from '../prisma';
import { z } from 'zod';
import { authedProcedure, publicProcedure, router } from '../trpc';

interface MyEvents {
  add: (data: Message) => void;
  isTypingUpdate: () => void;
}

class MyEventEmitter extends EventEmitter implements MyEvents {
  add(data: Message): void {
    this.emit('add', data);
  }
  isTypingUpdate(): void {
    this.emit('isTypingUpdate');
  }
}

const ee = new MyEventEmitter();

const currentlyTyping: Record<number, { lastTyped: Date }> = Object.create(null);

const interval = setInterval(() => {
  let updated = false;
  const now = Date.now();
  for (const [key, value] of Object.entries(currentlyTyping)) {
    const userId = Number(key);
    if (now - value.lastTyped.getTime() > 3000) {
      delete currentlyTyping[userId];
      updated = true;
    }
  }
  if (updated) {
    ee.emit('isTypingUpdate');
  }
}, 3e3);

process.on('SIGTERM', () => {
  clearInterval(interval);
});

export const messageRouter = router({
  add: authedProcedure
    .input(
      z.object({
        text: z.string().min(1),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const user = await prisma.user.findUnique({ where: { email: ctx.user.email ?? '' } });
      if (!user) {
        throw new Error("Usuario no encontrado");
      }
      const userId = user.id;
      const message = await prisma.message.create({
        data: {
          userId,
          message: input.text,
          source: 'SomeSource',
        },
      });
      ee.emit('add', message);
      delete currentlyTyping[userId];
      ee.emit('isTypingUpdate');
      return message;
    }),

  isTyping: publicProcedure
    .input(z.object({
      typing: z.boolean(),
      userId: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { typing, userId } = input;

      // Aquí actualizarías el estado de "está escribiendo" para el usuario
      // Esto podría implicar, por ejemplo, actualizar un mapa en memoria:
      if (typing) {
        currentlyTyping[userId] = { lastTyped: new Date() };
      } else {
        delete currentlyTyping[userId];
      }

      // Opcionalmente, emitir un evento para notificar el cambio
      ee.emit('isTypingUpdate');
    }),
  whoIsTyping: publicProcedure.subscription(() => {
    return observable<string[]>((emit) => {
      const onIsTypingUpdate = () => {
        const typingUsers = Object.keys(currentlyTyping);
        emit.next(typingUsers);
      };

      // Escuchar el evento de actualización
      ee.on('isTypingUpdate', onIsTypingUpdate);

      // Asegurarte de remover el listener cuando la suscripción se termina
      return () => {
        ee.off('isTypingUpdate', onIsTypingUpdate);
      };
    });
  }),
  infiniteMessages: publicProcedure
    .input(z.object({
      cursor: z.number().nullish(), // El cursor indica desde dónde cargar los mensajes siguientes
      limit: z.number().optional(), // Cuántos mensajes cargar
    }))
    .query(async ({ input }) => {
      const { cursor, limit = 10 } = input; // Establece un límite predeterminado

      const messages = await prisma.message.findMany({
        where: {
          id: cursor ? { lt: cursor } : undefined, // Carga mensajes anteriores al cursor
        },
        take: limit,
        orderBy: {
          id: 'desc', // Asume que quieres los mensajes más recientes primero
        },
      });

      return {
        messages,
        nextCursor: messages.length ? messages[messages.length - 1].id : null, // El cursor para la próxima carga
      };
    }),
  onNewMessage: publicProcedure.subscription(() => {
    return observable<Message>((emit) => {
      const listener = (message: Message) => {
        emit.next(message);
      };

      ee.on('newMessage', listener);

      return () => {
        ee.off('newMessage', listener);
      };
    });
  }),
});
