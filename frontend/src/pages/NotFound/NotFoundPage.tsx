import { useNavigate } from 'react-router';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <EmptyState
      title="Página não encontrada"
      description="O endereço acessado não existe."
      action={<Button onClick={() => navigate('/')}>Ir para a Home</Button>}
    />
  );
}
