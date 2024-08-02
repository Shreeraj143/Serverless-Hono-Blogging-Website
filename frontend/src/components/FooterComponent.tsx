import { Footer } from "flowbite-react";
import { BsGithub, BsInstagram, BsLinkedin, BsTwitter } from "react-icons/bs";

export default function FooterComponent() {
  return (
    <Footer container className="border border-t-8 border-blue-500">
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid w-full justify-between sm:flex md:grid-cols-1">
          <div className="text-2xl font-semibold">BlogSage</div>
          <div className="grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6">
            <div>
              <Footer.Title title="ABOUT" className="mb-3" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="https://www.linkedin.com/in/shreeraj-shinde/"
                  className="mb-2"
                >
                  Dev
                </Footer.Link>
                <Footer.Link href="/about" className="mb-2">
                  About BlogSage
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="FOLLOW US" className="mb-3" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="https://github.com/Shreeraj143"
                  className="mb-2"
                >
                  Github
                </Footer.Link>
                <Footer.Link
                  href="https://www.linkedin.com/in/shreeraj-shinde/"
                  className="mb-2"
                >
                  LinkedIn
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="LEGAL" className="mb-3" />
              <Footer.LinkGroup col>
                <Footer.Link href="#" className="mb-2">
                  Privacy Policy
                </Footer.Link>
                <Footer.Link href="#" className="mb-2">
                  Terms &amp; Conditions
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider className="mb-5 mt-6" />
        <div className="w-full sm:flex sm:items-center sm:justify-between">
          <Footer.Copyright
            href="#"
            by=" BlogSage"
            year={new Date().getFullYear()}
          />
          <div className="mt-4 flex gap-6 sm:mt-0 sm:justify-center">
            <Footer.Icon
              href="https://www.linkedin.com/in/shreeraj-shinde/"
              icon={BsLinkedin}
            />
            <Footer.Icon
              href="https://www.instagram.com/shreeraj1811/"
              icon={BsInstagram}
            />
            <Footer.Icon href="#" icon={BsTwitter} />
            <Footer.Icon
              href="https://github.com/Shreeraj143"
              icon={BsGithub}
            />
          </div>
        </div>
      </div>
    </Footer>
  );
}
