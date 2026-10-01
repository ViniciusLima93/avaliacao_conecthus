import styled from 'styled-components';
import { Card } from '../../components/ui/Card';
import { PageTitle } from '../../components/ui/PageTitle';
import { currentUser, getFirstName } from '../../config/session';
import { media } from '../../styles/theme';
import { WelcomeIllustration } from './WelcomeIllustration';

/** Ex.: "22, Novembro 2024" */
function formatToday(date = new Date()): string {
  const month = date.toLocaleDateString('pt-BR', { month: 'long' });
  const capitalized = month.charAt(0).toUpperCase() + month.slice(1);
  return `${date.getDate()}, ${capitalized} ${date.getFullYear()}`;
}

export function HomePage() {
  return (
    <>
      <PageTitle>Home</PageTitle>

      <Content>
        <Greeting>Olá {getFirstName(currentUser.name)}!</Greeting>
        <DateText>{formatToday()}</DateText>

        <Hero>
          <IllustrationBox>
            <WelcomeIllustration />
          </IllustrationBox>
          <WelcomeBox>Bem-vindo ao WenLock!</WelcomeBox>
        </Hero>
      </Content>
    </>
  );
}

const Content = styled(Card)`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

/* Spec: Manrope Bold 32px/44px, #0D1931 (desktop). */
const Greeting = styled.h2`
  font-size: 24px;
  font-weight: 700;
  line-height: 1.375;
  color: ${({ theme }) => theme.colors.navy};

  ${media.md} {
    font-size: 28px;
  }

  ${media.lg} {
    font-size: 32px;
  }
`;

/* Spec: Manrope SemiBold 18px, #0D1931 (desktop). */
const DateText = styled.p`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.navy};

  ${media.lg} {
    font-size: 18px;
  }
`;

const Hero = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 24px 0 8px;

  ${media.md} {
    padding: 40px 0 24px;
  }
`;

const IllustrationBox = styled.div`
  width: 100%;
  max-width: 300px;

  ${media.md} {
    max-width: 420px;
  }
`;

const WelcomeBox = styled.p`
  width: 100%;
  max-width: 520px;
  padding: 14px 16px;
  /* Spec: borda #272846, raio de 9px, sombra; texto Bold 28px/38px. */
  border: 1px solid ${({ theme }) => theme.colors.outline};
  border-radius: 9px;
  box-shadow: ${({ theme }) => theme.shadows.md};
  text-align: center;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.36;
  color: ${({ theme }) => theme.colors.heading};

  ${media.md} {
    font-size: 24px;
  }

  ${media.lg} {
    font-size: 28px;
  }
`;
