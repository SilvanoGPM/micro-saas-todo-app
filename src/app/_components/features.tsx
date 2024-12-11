import {
  BellRingIcon,
  ClipboardCheckIcon,
  MailsIcon,
  NotebookIcon,
} from 'lucide-react';

const features = [
  {
    icon: ClipboardCheckIcon,
    title: 'Tarefas',
    description: 'Crie, edite, exclua e marque suas tarefas como concluídas.',
  },
  {
    icon: NotebookIcon,
    title: 'Anotações',
    description:
      'Atribua anotações a suas tarefas para facilitar a organização.',
  },
  {
    icon: BellRingIcon,
    title: 'Notificações',
    description: 'Receba notificações diárias sobre suas tarefas pendentes.',
  },
  {
    icon: MailsIcon,
    title: 'E-mails',
    description: 'Receba e-mails diários com um resumo das suas tarefas.',
  },
];

export function LandingPageFeatures() {
  return (
    <section className="w-full max-w-6xl mx-auto flex-1 px-4 flex flex-col items-center text-center">
      <div>
        <h3 className="uppercase text-[#9c40ff] text-lg tracking-widest font-semibold">
          Funcionalidades
        </h3>

        <p className="text-balance tracking-tight text-3xl md:text-4xl font-bold">
          Tudo o que você precisa para gerenciar suas tarefas.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-8 mt-12 w-full">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="w-full max-w-[250px] flex flex-col items-center justify-start gap-3"
          >
            <div className="flex items-center justify-center text-[#9c40ffaa] bg-[#9c40ff55] rounded-full p-4 size-16">
              <feature.icon className="size-8" />
            </div>

            <h4 className="text-2xl font-bold">{feature.title}</h4>

            <p className="text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
