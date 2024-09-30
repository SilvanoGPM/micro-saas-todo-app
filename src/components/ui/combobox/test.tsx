import { fireEvent, render, screen } from '@testing-library/react';

import { matchMediaMock } from '$utils/tests';

import { Combobox, ComboboxOption } from '.';

describe('<Combobox />', () => {
  const options: ComboboxOption[] = [
    { label: 'Opção 1', value: '1' },
    { label: 'Opção 2', value: '2' },
    { label: 'Opção 3', value: '3' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    window.matchMedia = matchMediaMock(true);
  });

  test('deve renderizar o botão com o placeholder do combobox', () => {
    render(<Combobox options={options} />);

    expect(screen.getByRole('combobox')).toHaveTextContent('Escolha uma opção');
  });

  test('deve renderizar o botão com o valor inicial do combobox', () => {
    render(<Combobox options={options} initialOptions={[options[1]]} />);

    expect(screen.getByRole('combobox')).toHaveTextContent('Opção 2');
  });

  test('deve renderizar o botão com os valores iniciais do combobox', () => {
    render(
      <Combobox
        options={options}
        multiple
        initialOptions={options.slice(0, 2)}
      />,
    );

    expect(screen.getByRole('combobox')).toHaveTextContent('Opção 1');
    expect(screen.getByRole('combobox')).toHaveTextContent('Opção 2');
  });

  test('deve abrir o popover e mostrar as opções ao clicar no botão', () => {
    render(<Combobox options={options} placeholder="Escolha uma opção" />);

    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);

    expect(screen.getByText('Opção 1')).toBeInTheDocument();
    expect(screen.getByText('Opção 2')).toBeInTheDocument();
    expect(screen.getByText('Opção 3')).toBeInTheDocument();
  });

  test('deve abrir o drawer em dispositivos móveis', () => {
    window.matchMedia = matchMediaMock(false); // Simular mobile
    render(<Combobox options={options} placeholder="Escolha uma opção" />);

    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);

    expect(screen.getByTestId('combobox-drawer-content')).toBeInTheDocument();
    expect(screen.getByText('Opção 1')).toBeInTheDocument();
    expect(screen.getByText('Opção 2')).toBeInTheDocument();
    expect(screen.getByText('Opção 3')).toBeInTheDocument();
  });

  test('deve abrir o popover e mostrar as opções ao clicar no botão', () => {
    render(<Combobox options={options} placeholder="Escolha uma opção" />);

    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);

    expect(screen.getByText('Opção 1')).toBeInTheDocument();
    expect(screen.getByText('Opção 2')).toBeInTheDocument();
    expect(screen.getByText('Opção 3')).toBeInTheDocument();
  });

  test('deve selecionar uma opção e fechar o popover', () => {
    render(
      <Combobox
        options={options}
        placeholder="Escolha uma opção"
        closeOnSelect
      />,
    );

    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);

    const option = screen.getByText('Opção 2');
    fireEvent.click(option);

    expect(trigger).toHaveTextContent('Opção 2');
    expect(option).not.toBeInTheDocument();
  });

  test('deve selecionar uma opção e manter o popover aberto', () => {
    render(
      <Combobox
        options={options}
        placeholder="Escolha uma opção"
        closeOnSelect={false}
      />,
    );

    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);

    const option = screen.getByText('Opção 2');
    fireEvent.click(option);

    expect(trigger).toHaveTextContent('Opção 2');
    expect(option).toBeInTheDocument();
  });

  test('deve remover a seleção caso uma opção selecionada seja selecionada novamente', () => {
    render(
      <Combobox
        options={options}
        placeholder="Escolha uma opção"
        closeOnSelect={false}
      />,
    );

    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);

    const option = screen.getByText('Opção 2');
    fireEvent.click(option);
    fireEvent.click(option);

    expect(trigger).not.toHaveTextContent('Opção 2');
  });

  test('deve permitir selecionar múltiplas opções quando multiple é true', () => {
    render(
      <Combobox
        options={options}
        placeholder="Escolha uma opção"
        multiple
        closeOnSelect={false}
      />,
    );

    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);

    const option1 = screen.getByText('Opção 1');
    const option2 = screen.getByText('Opção 2');

    fireEvent.click(option1);
    fireEvent.click(option2);

    expect(trigger).toHaveTextContent('Opção 1');
    expect(trigger).toHaveTextContent('Opção 2');
  });

  test('deve permitir remover uma opção ao clicar nela no botão', () => {
    render(
      <Combobox
        options={options}
        placeholder="Escolha uma opção"
        multiple
        closeOnSelect={false}
      />,
    );

    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);

    const option1 = screen.getByText('Opção 1');
    const option2 = screen.getByText('Opção 2');

    fireEvent.click(option1);
    fireEvent.click(option2);

    const option1InButton = screen.getByTestId('remove-active-option-1');
    const option2InButton = screen.getByTestId('remove-active-option-2');

    fireEvent.click(option1InButton);
    fireEvent.click(option2InButton);

    expect(trigger).not.toHaveTextContent('Opção 1');
    expect(trigger).not.toHaveTextContent('Opção 2');
  });

  test('deve exibir o placeholder novamente se todas as opções forem removidas', () => {
    render(
      <Combobox
        options={options}
        placeholder="Escolha uma opção"
        multiple
        closeOnSelect={false}
      />,
    );

    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);

    const option1 = screen.getByText('Opção 1');
    fireEvent.click(option1);
    fireEvent.click(option1);

    expect(trigger).toHaveTextContent('Escolha uma opção');
  });

  test('deve filtrar as opções com base no input', () => {
    render(
      <Combobox
        options={options}
        searchMessage="Digite para pesquisar"
        emptyMessage="Nenhuma opção encontrada."
      />,
    );

    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);

    const input = screen.getByPlaceholderText('Digite para pesquisar');
    fireEvent.change(input, { target: { value: 'Opção 2' } });

    expect(screen.getByText('Opção 2')).toBeInTheDocument();
    expect(screen.queryByText('Opção 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Opção 3')).not.toBeInTheDocument();

    expect(
      screen.queryByText('Nenhuma opção encontrada.'),
    ).not.toBeInTheDocument();
  });

  test('deve mostrar uma mensagem quando nenhum resultado for encontrado', () => {
    render(
      <Combobox
        options={options}
        searchMessage="Digite para pesquisar"
        emptyMessage="Nenhuma opção encontrada."
      />,
    );

    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);

    const input = screen.getByPlaceholderText('Digite para pesquisar');
    fireEvent.change(input, { target: { value: 'Opção Inválida' } });

    expect(screen.getByText('Nenhuma opção encontrada.')).toBeInTheDocument();
  });

  test('deve renderizar leftElement e rightElement corretamente', () => {
    render(
      <Combobox
        options={options}
        leftElement={<span>Esquerda</span>}
        rightElement={<span>Direita</span>}
        placeholder="Escolha uma opção"
      />,
    );

    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveTextContent('Esquerda');
    expect(trigger).toHaveTextContent('Direita');
  });

  test('deve renderizar os elementos de forma customizada', () => {
    render(
      <Combobox
        options={options}
        closeOnSelect={false}
        renderOption={(option, isActive) => (
          <p data-testid={`custom-render-${option.value}`}>
            {`${option.value} - ${option.label} - ${isActive}`}
          </p>
        )}
      />,
    );

    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);

    const option = screen.getByTestId('custom-render-2');
    fireEvent.click(option);

    expect(screen.getByText('1 - Opção 1 - false')).toBeInTheDocument();
    expect(screen.getByText('2 - Opção 2 - true')).toBeInTheDocument();
    expect(screen.getByText('3 - Opção 3 - false')).toBeInTheDocument();
  });

  test('deve chamar a função onSelect corretamente', () => {
    const onSelectMock = jest.fn();

    render(
      <Combobox
        options={options}
        onSelect={onSelectMock}
        placeholder="Escolha uma opção"
      />,
    );

    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);

    const option = screen.getByText('Opção 2');
    fireEvent.click(option);

    expect(onSelectMock).toHaveBeenCalledWith(
      [{ label: 'Opção 2', value: '2' }],
      'SELECT',
    );
  });

  test('deve mostrar o botão de criar uma nova opção', () => {
    render(
      <Combobox
        creatable
        options={options}
        searchMessage="Digite para pesquisar"
        placeholder="Escolha uma opção"
      />,
    );

    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);

    const input = screen.getByPlaceholderText('Digite para pesquisar');
    fireEvent.change(input, { target: { value: 'Teste Inexistente' } });

    expect(screen.getByText('Criar "Teste Inexistente"')).toBeInTheDocument();
  });

  test('deve criar uma nova opção e adicionar ela na lista', () => {
    render(
      <Combobox
        creatable
        closeOnSelect={false}
        options={options}
        searchMessage="Digite para pesquisar"
        placeholder="Escolha uma opção"
      />,
    );

    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);

    const input = screen.getByPlaceholderText('Digite para pesquisar');
    fireEvent.change(input, { target: { value: 'Opção Criada' } });

    const button = screen.getByText('Criar "Opção Criada"');
    fireEvent.click(button);

    expect(trigger).toHaveTextContent('Opção Criada');

    expect(
      document.querySelector('[data-value="Opção Criada-4"]'),
    ).toHaveTextContent('Opção Criada');
  });

  test('deve criar uma nova opção e adicionar ela na lista', () => {
    render(
      <Combobox
        creatable
        closeOnSelect={false}
        options={options}
        searchMessage="Digite para pesquisar"
        placeholder="Escolha uma opção"
      />,
    );

    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);

    const input = screen.getByPlaceholderText('Digite para pesquisar');
    fireEvent.change(input, { target: { value: 'Opção Criada' } });

    const button = screen.getByText('Criar "Opção Criada"');
    fireEvent.click(button);

    expect(trigger).toHaveTextContent('Opção Criada');

    expect(
      document.querySelector('[data-value="Opção Criada-4"]'),
    ).toHaveTextContent('Opção Criada');
  });

  test('deve chamar a função de callback quando clicar no botão de criar nova opção', () => {
    const onCreateMock = jest.fn();

    render(
      <Combobox
        creatable
        onCreate={onCreateMock}
        options={options}
        searchMessage="Digite para pesquisar"
        placeholder="Escolha uma opção"
      />,
    );

    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);

    const input = screen.getByPlaceholderText('Digite para pesquisar');
    fireEvent.change(input, { target: { value: 'Opção Para Criada' } });

    const button = screen.getByText('Criar "Opção Para Criada"');
    fireEvent.click(button);

    expect(onCreateMock).toBeCalledWith({
      __isNew: true,
      label: 'Opção Para Criada',
      value: 'Opção Para Criada-4',
    });
  });
});
