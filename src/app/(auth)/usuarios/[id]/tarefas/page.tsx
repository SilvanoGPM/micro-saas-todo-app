import {
  DefaultPage,
  DefaultPageHeader,
  DefaultPageSection,
  DefaultPageTitle,
} from '$components/dashboard/page';
import { TodosTable } from '$components/dashboard/todos/table';
import { getCurrentUser } from '$libs/auth/get-current-user';
import { getFirstString } from '$utils/strings';

import { getUserName } from './actions';

export default async function UserTodosPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getCurrentUser();
  const userName = await getUserName(params.id);

  return (
    <DefaultPage>
      <DefaultPageHeader>
        <DefaultPageTitle>
          Tarefas de {getFirstString(userName)}
        </DefaultPageTitle>
      </DefaultPageHeader>

      <DefaultPageSection>
        <TodosTable user={user} userId={params.id} />
      </DefaultPageSection>
    </DefaultPage>
  );
}
