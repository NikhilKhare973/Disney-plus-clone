import styled from 'styled-components'

// import disneyLogo from '/images/disney-logo.svg'

const Footer = () => {
	const currentYear = new Date().getFullYear()

	return (
		<StyledFooter>
			<Wrapper>
				<StyledLogo src="/images/disney-logo.svg" alt='Logo of Disney+ App'></StyledLogo>
				<StyledParagraph>
					&copy; {currentYear}, coded by <a href='https://github.com/NikhilKhare973/Disney-plus-clone' target="_blank" >Nikhil Khare</a>
				</StyledParagraph>
			</Wrapper>
		</StyledFooter>
	)
}

export default Footer;

const StyledFooter = styled.footer`
	width: 100%;
	height: 100px;
	position: relative;
	bottom: 0;
`

const Wrapper = styled.section`
	display: grid;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	padding: 10px;
	background-color: #030408;
`;

const StyledLogo = styled.img`
	height: 50px;
`;

const StyledParagraph = styled.p`
	margin: 5px 0;
	font-size: 15px;
`;