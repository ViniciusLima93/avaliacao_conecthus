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

const Greeting = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.heading};

  ${media.md} {
    font-size: 22px;
  }
`;

const DateText = styled.p`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.heading};
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
  max-width: 444px;
  padding: 14px 16px;
  border: 1px solid ${({ theme }) => theme.colors.navyLight};
  border-radius: ${({ theme }) => theme.radii.md};
  text-align: center;
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.heading};

  ${media.md} {
    font-size: 20px;
  }
`;
