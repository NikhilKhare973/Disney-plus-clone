import styled from 'styled-components'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <StyledFooter>
      <TopSection>
        <Column>
          <ColumnTitle>Company</ColumnTitle>
          <FooterLink href="https://github.com/NikhilKhare973/Disney-plus-clone" target="_blank" rel="noreferrer">About Project</FooterLink>
          <FooterLink href="https://github.com/NikhilKhare973" target="_blank" rel="noreferrer">Developer</FooterLink>
        </Column>

        <Column>
          <ColumnTitle>Browse</ColumnTitle>
          <FooterLink href="/home">Home</FooterLink>
          <FooterLink href="/home">Originals</FooterLink>
          <FooterLink href="/home">Movies</FooterLink>
          <FooterLink href="/home">Series</FooterLink>
        </Column>

        <Column>
          <ColumnTitle>Need Help?</ColumnTitle>
          <FooterLink href="https://github.com/NikhilKhare973/Disney-plus-clone/issues" target="_blank" rel="noreferrer">Report a Bug</FooterLink>
          <FooterLink href="https://github.com/NikhilKhare973/Disney-plus-clone" target="_blank" rel="noreferrer">Give Feedback</FooterLink>
        </Column>

        <Column>
          <ColumnTitle>Connect with Us</ColumnTitle>
          <SocialRow>
            <SocialLink href="https://github.com/NikhilKhare973" target="_blank" rel="noreferrer">
              {/* GitHub SVG icon */}
              <svg height="24" width="24" viewBox="0 0 16 16" fill="white">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38
                  0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13
                  -.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66
                  .07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15
                  -.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27
                  .68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12
                  .51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48
                  0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
              </svg>
            </SocialLink>
          </SocialRow>
        </Column>
      </TopSection>

      <Divider />

      <BottomSection>
        <StyledLogo src="/images/disney-logo.svg" alt="Disney+ Logo" />
        <LegalLinks>
          <FooterLink href="#">Terms of Use</FooterLink>
          <FooterLink href="#">Privacy Policy</FooterLink>
          <FooterLink href="#">FAQ</FooterLink>
        </LegalLinks>
        <Copyright>
          &copy; {currentYear} coded by{' '}
          <a href="https://github.com/NikhilKhare973/Disney-plus-clone" target="_blank" rel="noreferrer">
            Nikhil Khare
          </a>
        </Copyright>
      </BottomSection>
    </StyledFooter>
  )
}

export default Footer;

const StyledFooter = styled.footer`
  width: 100%;
  background-color: #030408;
  padding: 40px calc(3.5vw + 5px) 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const TopSection = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ColumnTitle = styled.h4`
  color: #f9f9f9;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 8px;
  font-family: 'Inter', sans-serif;
`;

const FooterLink = styled.a`
  color: rgba(249, 249, 249, 0.55);
  font-size: 13px;
  font-weight: 400;
  letter-spacing: 0.5px;
  text-decoration: none;
  transition: color 0.2s ease;
  font-family: 'Inter', sans-serif;

  &:hover {
    color: #f9f9f9;
  }
`;

const SocialRow = styled.div`
  display: flex;
  gap: 16px;
`;

const SocialLink = styled.a`
  opacity: 0.6;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 1;
  }
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 24px;
`;

const BottomSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`;

const StyledLogo = styled.img`
  height: 36px;
`;

const LegalLinks = styled.div`
  display: flex;
  gap: 24px;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }
`;

const Copyright = styled.p`
  color: rgba(249, 249, 249, 0.5);
  font-size: 14px;
  letter-spacing: 1px;

  a {
    color: rgba(249, 249, 249, 0.8);
    text-decoration: none;

    &:hover {
      color: #f9f9f9;
    }
  }
`;