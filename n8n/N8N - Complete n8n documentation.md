*Name* Trigger node documentation Table of Contents 

CODE\_OF\_CONDUCT.md 

Contributor Covenant Code of Conduct 

Our Pledge 

In the interest of fostering an open and welcoming environment, we as contributors and maintainers pledge to making participation in our project and our community a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, sex characteristics, gender identity and expression, level of experience, education, socio-economic status, nationality, personal appearance, race, religion, or sexual identity and orientation. 

Our Standards 

Examples of behavior that contributes to creating a positive environment include: 

∙ Using welcoming and inclusive language 

∙ Being respectful of differing viewpoints and experiences 

∙ Gracefully accepting constructive criticism 

∙ Focusing on what is best for the community 

∙ Showing empathy towards other community members 

Examples of unacceptable behavior by participants include: 

∙ The use of sexualized language or imagery and unwelcome sexual attention or advances ∙ Trolling, insulting/derogatory comments, and personal or political attacks ∙ Public or private harassment 

∙ Publishing others’ private information, such as a physical or electronic address, without explicit permission 

∙ Other conduct which could reasonably be considered inappropriate in a professional setting 

Our Responsibilities 

Project maintainers are responsible for clarifying the standards of acceptable behavior and are expected to take appropriate and fair corrective action in response to any instances of unacceptable behavior.  
Project maintainers have the right and responsibility to remove, edit, or reject comments, commits, code, wiki edits, issues, and other contributions that are not aligned to this Code of Conduct, or to ban temporarily or permanently any contributor for other behaviors that they deem inappropriate, threatening, offensive, or harmful. 

Scope 

This Code of Conduct applies both within project spaces and in public spaces when an individual is representing the project or its community. Examples of representing a project or community include using an official project e-mail address, posting via an official social media account, or acting as an appointed representative at an online or offline event. Representation of a project may be further defined and clarified by project maintainers. 

Enforcement 

Instances of abusive, harassing, or otherwise unacceptable behavior may be reported by contacting the project team at jan@n8n.io. All complaints will be reviewed and investigated and will result in a response that is deemed necessary and appropriate to the circumstances. The project team is obligated to maintain confidentiality with regard to the reporter of an incident. Further details of specific enforcement policies may be posted separately. 

Project maintainers who do not follow or enforce the Code of Conduct in good faith may face temporary or permanent repercussions as determined by other members of the project’s leadership. 

Attribution 

This Code of Conduct is adapted from the Contributor Covenant, version 1.4, available at https://www.contributor-covenant.org/version/1/4/code-of-conduct.html 

For answers to common questions about this code of conduct, see https://www.contributor covenant.org/faq 

CONTRIBUTING.md 

Contributing 

If you want to contribute to this repository \- thank you\! Before you start, have a look at the existing documentation to get an idea of the structure and writing conventions n8n uses. In writing your documentation, please follow the guidelines described below, to ensure quality and consistency with n8n styles. 

Before you start 

Style 

n8n uses the Microsoft Writing Style Guide.  
Refer to Styles for a quickstart, and guidance on style linting. 

n8n’s license 

Be aware that n8n is fair code licensed. For more information, refer to the License documentation. 

Writing docs 

You can either: 

∙ Check out the docs repository and work on your local machine. 

∙ Make your changes directly in GitHub. 

These instructions are for external users. Members of the n8n organization don’t need to fork the repository. 

Working locally 

This method allows you to work in your own text editor, and preview your work while editing. You need Git installed, and a GitHub account. 

Fork the documentation repository. 

Then clone your fork: 

git clone https://github.com/\<your-username\>/n8n-docs.git 

cd n8n-docs 

git checkout \-b \<branch-name\> 

Make your changes. Push your branch: 

git add \* 

git commit \-m "\<short summary of changes\>" 

git push \--set-upstream origin \<branch-name\> 

In GitHub, create a pull request to merge the work from your fork to main in the docs repository. Writing in GitHub 

This method is fine for small changes, but not recommended for larger pieces of work. You need a GitHub account. 

Follow GitHub’s documentation on editing files. 

Previewing your work 

You can build the docs locally to preview them, or submit a pull request. All pull requests automatically trigger a preview build. 

For instructions on previewing the docs locally, refer to the README.  
General checklist 

Before submitting a PR, make sure your contribution ticks all these boxes: 

 All necessary files and images are included. 

 All links are working and direct to the right location. 

 All documentation files end with an empty newline. 

 The commit message describes the changes you made. 

 The PR explains the changes you made and why they’re necessary. 

 You have read and accepted the code of conduct and contributor license agreement. Documenting nodes 

n8n provides templates for node docs. 

∙ **Nodes and trigger nodes:** Create a directory with the name of the node at docs/integrations/builtin/app-nodes/ or 

docs/integrations/builtin/trigger-nodes/ containing: 

o A text file named n8n-nodes-base.\<node-name\>.md describing the functionality of the relevant node. 

∙ **Credentials:** Create a document with the name of the node at   
docs/integrations/builtin/credentials/ containing: 

o A text file with the node name describing how to get credentials for the relevant node. 

A standard node doc includes the following parts: 

∙ Node description 

o Describe the purpose and function of the node. 

∙ Operations 

o Enter the resources and operations as they’re named in the nodes. 

In the credentials doc: 

∙ If there is more than one authentication method, list OAuth first. 

∙ If possible, avoid documenting external products. Instead, provide links to the relevant product documentation. For example, for guidance on getting credentials (such as how to get an API token for a service), provide a link to the product’s API authentication docs.  
CONTRIBUTOR\_LICENSE\_AGREEMENT.md 

n8n Contributor License Agreement 

I give n8n permission to license my contributions on any terms they like. I am giving them this license in order to make it possible for them to accept my contributions into their project. 

***As far as the law allows, my contributions come as is, without any warranty or condition, and I will not be liable to anyone for any damages related to this software or this license, under any kind of legal claim.*** 

LICENSE.md 

â€œCommons Clauseâ€ License Condition v1.0 

The Software is provided to you by the Licensor under the License, as defined below, subject to the following condition. 

Without limiting other conditions in the License, the grant of rights under the License will not include, and the License does not grant to you, the right to Sell the Software. 

For purposes of the foregoing, â€œSellâ€ means practicing any or all of the rights granted to you under the License to provide to third parties, for a fee or other consideration (including without limitation fees for hosting or consulting/ support services related to the Software), a product or service whose value derives, entirely or substantially, from the functionality of the Software. Any license notice or attribution required by the License must also include this Commons Clause License Condition notice. 

Software: n8n 

License: Apache 2.0 

Licensor: n8n GmbH 

 Apache License 

 Version 2.0, January 2004 

 http://www.apache.org/licenses/ 

TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION 1\. Definitions. 

“License” shall mean the terms and conditions for use, reproduction, and distribution as defined by Sections 1 through 9 of this document. 

“Licensor” shall mean the copyright owner or entity authorized by the copyright owner that is granting the License.  
“Legal Entity” shall mean the union of the acting entity and all other entities that control, are controlled by, or are under common control with that entity. For the purposes of this definition, “control” means (i) the power, direct or indirect, to cause the direction or management of such entity, whether by contract or otherwise, or (ii) ownership of fifty percent (50%) or more of the outstanding shares, or (iii) beneficial ownership of such entity. 

“You” (or “Your”) shall mean an individual or Legal Entity exercising permissions granted by this License. 

“Source” form shall mean the preferred form for making modifications, including but not limited to software source code, documentation source, and configuration files. 

“Object” form shall mean any form resulting from mechanical transformation or translation of a Source form, including but not limited to compiled object code, generated documentation, and conversions to other media types. 

“Work” shall mean the work of authorship, whether in Source or Object form, made available under the License, as indicated by a copyright notice that is included in or attached to the work (an example is provided in the Appendix below). 

“Derivative Works” shall mean any work, whether in Source or Object form, that is based on (or derived from) the Work and for which the editorial revisions, annotations, elaborations, or other modifications represent, as a whole, an original work of authorship. For the purposes of this License, Derivative Works shall not include works that remain separable from, or merely link (or bind by name) to the interfaces of, the Work and Derivative Works thereof. 

“Contribution” shall mean any work of authorship, including the original version of the Work and any modifications or additions to that Work or Derivative Works thereof, that is intentionally submitted to Licensor for inclusion in the Work by the copyright owner or by an individual or Legal Entity authorized to submit on behalf of the copyright owner. For the purposes of this definition, “submitted” means any form of electronic, verbal, or written communication sent to the Licensor or its representatives, including but not limited to communication on electronic mailing lists, source code control systems, and issue tracking systems that are managed by, or on behalf of, the Licensor for the purpose of discussing and improving the Work, but excluding communication that is conspicuously marked or otherwise designated in writing by the copyright owner as “Not a Contribution.” 

“Contributor” shall mean Licensor and any individual or Legal Entity on behalf of whom a Contribution has been received by Licensor and subsequently incorporated within the Work. 

2\. Grant of Copyright License. Subject to the terms and conditions of this License, each Contributor hereby grants to You a perpetual, worldwide, non-exclusive, no-charge, royalty-free, irrevocable copyright license to reproduce, prepare Derivative Works of, publicly display, publicly perform, sublicense, and distribute the Work and such Derivative Works in Source or Object form.  
3\. Grant of Patent License. Subject to the terms and conditions of this License, each Contributor hereby grants to You a perpetual, worldwide, non-exclusive, no-charge, royalty-free, irrevocable (except as stated in this section) patent license to make, have made, use, offer to sell, sell, import, and otherwise transfer the Work, where such license applies only to those patent claims licensable by such Contributor that are necessarily infringed by their Contribution(s) alone or by combination of their Contribution(s) with the Work to which such Contribution(s) was submitted. If You institute patent litigation against any entity (including a cross-claim or counterclaim in a lawsuit) alleging that the Work or a Contribution incorporated within the Work constitutes direct or contributory patent infringement, then any patent licenses granted to You under this License for that Work shall terminate as of the date such litigation is filed. 

4\. Redistribution. You may reproduce and distribute copies of the Work or Derivative Works thereof in any medium, with or without modifications, and in Source or Object form, provided that You meet the following conditions: 

(a) You must give any other recipients of the Work or Derivative Works a copy of this License; and 

(b) You must cause any modified files to carry prominent notices stating that You changed the files; and 

(c) You must retain, in the Source form of any Derivative Works that You distribute, all copyright, patent, trademark, and attribution notices from the Source form of the Work, excluding those notices that do not pertain to any part of the Derivative Works; and 

(d) If the Work includes a “NOTICE” text file as part of its distribution, then any Derivative Works that You distribute must include a readable copy of the attribution notices contained within such NOTICE file, excluding those notices that do not pertain to any part of the Derivative Works, in at least one of the following places: within a NOTICE text file distributed as part of the Derivative Works; within the Source form or documentation, if provided along with the Derivative Works; or, within a display generated by the Derivative Works, if and wherever such third-party notices normally appear. The contents of the NOTICE file are for informational purposes only and do not modify the License. You may add Your own attribution notices within Derivative Works that You distribute, alongside or as an addendum to the NOTICE text from the Work, provided that such additional attribution notices cannot be construed as modifying the License. 

You may add Your own copyright statement to Your modifications and may provide additional or different license terms and conditions for use, reproduction, or distribution of Your modifications, or for any such Derivative Works as a whole, provided Your use, reproduction, and distribution of the Work otherwise complies with the conditions stated in this License. 

5\. Submission of Contributions. Unless You explicitly state otherwise, any Contribution intentionally submitted for inclusion in the Work by You to the Licensor shall be under  
the terms and conditions of this License, without any additional terms or conditions. Notwithstanding the above, nothing herein shall supersede or modify the terms of any separate license agreement you may have executed with Licensor regarding such Contributions. 

6\. Trademarks. This License does not grant permission to use the trade names, trademarks, service marks, or product names of the Licensor, except as required for reasonable and customary use in describing the origin of the Work and reproducing the content of the NOTICE file. 

7\. Disclaimer of Warranty. Unless required by applicable law or agreed to in writing, Licensor provides the Work (and each Contributor provides its Contributions) on an “AS IS” BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied, including, without limitation, any warranties or conditions of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A PARTICULAR PURPOSE. You are solely responsible for determining the appropriateness of using or redistributing the Work and assume any risks associated with Your exercise of permissions under this License. 

8\. Limitation of Liability. In no event and under no legal theory, whether in tort (including negligence), contract, or otherwise, unless required by applicable law (such as deliberate and grossly negligent acts) or agreed to in writing, shall any Contributor be liable to You for damages, including any direct, indirect, special, incidental, or consequential damages of any character arising as a result of this License or out of the use or inability to use the Work (including but not limited to damages for loss of goodwill, work stoppage, computer failure or malfunction, or any and all other commercial damages or losses), even if such Contributor has been advised of the possibility of such damages. 

9\. Accepting Warranty or Additional Liability. While redistributing the Work or Derivative Works thereof, You may choose to offer, and charge a fee for, acceptance of support, warranty, indemnity, or other liability obligations and/or rights consistent with this License. However, in accepting such obligations, You may act only on Your own behalf and on Your sole responsibility, not on behalf of any other Contributor, and only if You agree to indemnify, defend, and hold each Contributor harmless for any liability incurred by, or claims asserted against, such Contributor by reason of your accepting any such warranty or additional liability. 

END OF TERMS AND CONDITIONS 

APPENDIX: How to apply the Apache License to your work. 

 To apply the Apache License to your work, attach the following  boilerplate notice, with the fields enclosed by brackets "\[\]"  replaced with your own identifying information. (Don't include  the brackets\!) The text should be enclosed in the appropriate  comment syntax for the file format. We also recommend that a  file or class name and description of purpose be included on the  same "printed page" as the copyright notice for easier 

 identification within third-party archives.  
Copyright \[2020\] \[n8n GmbH\] 

Licensed under the Apache License, Version 2.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at 

 http://www.apache.org/licenses/LICENSE-2.0 

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an “AS IS” BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License. 

master-n8n-docs.md 

CODE\_OF\_CONDUCT.md 

Contributor Covenant Code of Conduct 

Our Pledge 

In the interest of fostering an open and welcoming environment, we as contributors and maintainers pledge to making participation in our project and our community a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, sex characteristics, gender identity and expression, level of experience, education, socio-economic status, nationality, personal appearance, race, religion, or sexual identity and orientation. 

Our Standards 

Examples of behavior that contributes to creating a positive environment include: 

∙ Using welcoming and inclusive language 

∙ Being respectful of differing viewpoints and experiences 

∙ Gracefully accepting constructive criticism 

∙ Focusing on what is best for the community 

∙ Showing empathy towards other community members 

Examples of unacceptable behavior by participants include: 

∙ The use of sexualized language or imagery and unwelcome sexual attention or advances ∙ Trolling, insulting/derogatory comments, and personal or political attacks ∙ Public or private harassment 

∙ Publishing others’ private information, such as a physical or electronic address, without explicit permission 

∙ Other conduct which could reasonably be considered inappropriate in a professional setting  
Our Responsibilities 

Project maintainers are responsible for clarifying the standards of acceptable behavior and are expected to take appropriate and fair corrective action in response to any instances of unacceptable behavior. 

Project maintainers have the right and responsibility to remove, edit, or reject comments, commits, code, wiki edits, issues, and other contributions that are not aligned to this Code of Conduct, or to ban temporarily or permanently any contributor for other behaviors that they deem inappropriate, threatening, offensive, or harmful. 

Scope 

This Code of Conduct applies both within project spaces and in public spaces when an individual is representing the project or its community. Examples of representing a project or community include using an official project e-mail address, posting via an official social media account, or acting as an appointed representative at an online or offline event. Representation of a project may be further defined and clarified by project maintainers. 

Enforcement 

Instances of abusive, harassing, or otherwise unacceptable behavior may be reported by contacting the project team at jan@n8n.io. All complaints will be reviewed and investigated and will result in a response that is deemed necessary and appropriate to the circumstances. The project team is obligated to maintain confidentiality with regard to the reporter of an incident. Further details of specific enforcement policies may be posted separately. 

Project maintainers who do not follow or enforce the Code of Conduct in good faith may face temporary or permanent repercussions as determined by other members of the project’s leadership. 

Attribution 

This Code of Conduct is adapted from the Contributor Covenant, version 1.4, available at https://www.contributor-covenant.org/version/1/4/code-of-conduct.html 

For answers to common questions about this code of conduct, see https://www.contributor covenant.org/faq 

CONTRIBUTING.md 

Contributing 

If you want to contribute to this repository \- thank you\! Before you start, have a look at the existing documentation to get an idea of the structure and writing conventions n8n uses. In writing your documentation, please follow the guidelines described below, to ensure quality and consistency with n8n styles.  
Before you start 

Style 

n8n uses the Microsoft Writing Style Guide. 

Refer to Styles for a quickstart, and guidance on style linting. 

n8n’s license 

Be aware that n8n is fair code licensed. For more information, refer to the License documentation. 

Writing docs 

You can either: 

∙ Check out the docs repository and work on your local machine. 

∙ Make your changes directly in GitHub. 

These instructions are for external users. Members of the n8n organization don’t need to fork the repository. 

Working locally 

This method allows you to work in your own text editor, and preview your work while editing. You need Git installed, and a GitHub account. 

Fork the documentation repository. 

Then clone your fork: 

git clone https://github.com/\<your-username\>/n8n-docs.git 

cd n8n-docs 

git checkout \-b \<branch-name\> 

Make your changes. Push your branch: 

git add \* 

git commit \-m "\<short summary of changes\>" 

git push \--set-upstream origin \<branch-name\> 

In GitHub, create a pull request to merge the work from your fork to main in the docs repository. Writing in GitHub 

This method is fine for small changes, but not recommended for larger pieces of work. You need a GitHub account. 

Follow GitHub’s documentation on editing files.  
Previewing your work 

You can build the docs locally to preview them, or submit a pull request. All pull requests automatically trigger a preview build. 

For instructions on previewing the docs locally, refer to the README. 

General checklist 

Before submitting a PR, make sure your contribution ticks all these boxes: 

 All necessary files and images are included. 

 All links are working and direct to the right location. 

 All documentation files end with an empty newline. 

 The commit message describes the changes you made. 

 The PR explains the changes you made and why they’re necessary. 

 You have read and accepted the code of conduct and contributor license agreement. Documenting nodes 

n8n provides templates for node docs. 

∙ **Nodes and trigger nodes:** Create a directory with the name of the node at docs/integrations/builtin/app-nodes/ or 

docs/integrations/builtin/trigger-nodes/ containing: 

o A text file named n8n-nodes-base.\<node-name\>.md describing the functionality of the relevant node. 

∙ **Credentials:** Create a document with the name of the node at   
docs/integrations/builtin/credentials/ containing: 

o A text file with the node name describing how to get credentials for the relevant node. 

A standard node doc includes the following parts: 

∙ Node description 

o Describe the purpose and function of the node. 

∙ Operations 

o Enter the resources and operations as they’re named in the nodes. 

In the credentials doc: 

∙ If there is more than one authentication method, list OAuth first. 

∙ If possible, avoid documenting external products. Instead, provide links to the relevant product documentation. For example, for guidance on getting credentials (such as how to get an API token for a service), provide a link to the product’s API authentication docs.  
CONTRIBUTOR\_LICENSE\_AGREEMENT.md 

n8n Contributor License Agreement 

I give n8n permission to license my contributions on any terms they like. I am giving them this license in order to make it possible for them to accept my contributions into their project. 

***As far as the law allows, my contributions come as is, without any warranty or condition, and I will not be liable to anyone for any damages related to this software or this license, under any kind of legal claim.*** 

LICENSE.md 

â€œCommons Clauseâ€ License Condition v1.0 

The Software is provided to you by the Licensor under the License, as defined below, subject to the following condition. 

Without limiting other conditions in the License, the grant of rights under the License will not include, and the License does not grant to you, the right to Sell the Software. 

For purposes of the foregoing, â€œSellâ€ means practicing any or all of the rights granted to you under the License to provide to third parties, for a fee or other consideration (including without limitation fees for hosting or consulting/ support services related to the Software), a product or service whose value derives, entirely or substantially, from the functionality of the Software. Any license notice or attribution required by the License must also include this Commons Clause License Condition notice. 

Software: n8n 

License: Apache 2.0 

Licensor: n8n GmbH 

 Apache License 

 Version 2.0, January 2004 

 http://www.apache.org/licenses/ 

TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION 1\. Definitions. 

“License” shall mean the terms and conditions for use, reproduction, and distribution as defined by Sections 1 through 9 of this document. 

“Licensor” shall mean the copyright owner or entity authorized by the copyright owner that is granting the License.  
“Legal Entity” shall mean the union of the acting entity and all other entities that control, are controlled by, or are under common control with that entity. For the purposes of this definition, “control” means (i) the power, direct or indirect, to cause the direction or management of such entity, whether by contract or otherwise, or (ii) ownership of fifty percent (50%) or more of the outstanding shares, or (iii) beneficial ownership of such entity. 

“You” (or “Your”) shall mean an individual or Legal Entity exercising permissions granted by this License. 

“Source” form shall mean the preferred form for making modifications, including but not limited to software source code, documentation source, and configuration files. 

“Object” form shall mean any form resulting from mechanical transformation or translation of a Source form, including but not limited to compiled object code, generated documentation, and conversions to other media types. 

“Work” shall mean the work of authorship, whether in Source or Object form, made available under the License, as indicated by a copyright notice that is included in or attached to the work (an example is provided in the Appendix below). 

“Derivative Works” shall mean any work, whether in Source or Object form, that is based on (or derived from) the Work and for which the editorial revisions, annotations, elaborations, or other modifications represent, as a whole, an original work of authorship. For the purposes of this License, Derivative Works shall not include works that remain separable from, or merely link (or bind by name) to the interfaces of, the Work and Derivative Works thereof. 

“Contribution” shall mean any work of authorship, including the original version of the Work and any modifications or additions to that Work or Derivative Works thereof, that is intentionally submitted to Licensor for inclusion in the Work by the copyright owner or by an individual or Legal Entity authorized to submit on behalf of the copyright owner. For the purposes of this definition, “submitted” means any form of electronic, verbal, or written communication sent to the Licensor or its representatives, including but not limited to communication on electronic mailing lists, source code control systems, and issue tracking systems that are managed by, or on behalf of, the Licensor for the purpose of discussing and improving the Work, but excluding communication that is conspicuously marked or otherwise designated in writing by the copyright owner as “Not a Contribution.” 

“Contributor” shall mean Licensor and any individual or Legal Entity on behalf of whom a Contribution has been received by Licensor and subsequently incorporated within the Work. 

2\. Grant of Copyright License. Subject to the terms and conditions of this License, each Contributor hereby grants to You a perpetual, worldwide, non-exclusive, no-charge, royalty-free, irrevocable copyright license to reproduce, prepare Derivative Works of, publicly display, publicly perform, sublicense, and distribute the Work and such Derivative Works in Source or Object form.  
3\. Grant of Patent License. Subject to the terms and conditions of this License, each Contributor hereby grants to You a perpetual, worldwide, non-exclusive, no-charge, royalty-free, irrevocable (except as stated in this section) patent license to make, have made, use, offer to sell, sell, import, and otherwise transfer the Work, where such license applies only to those patent claims licensable by such Contributor that are necessarily infringed by their Contribution(s) alone or by combination of their Contribution(s) with the Work to which such Contribution(s) was submitted. If You institute patent litigation against any entity (including a cross-claim or counterclaim in a lawsuit) alleging that the Work or a Contribution incorporated within the Work constitutes direct or contributory patent infringement, then any patent licenses granted to You under this License for that Work shall terminate as of the date such litigation is filed. 

4\. Redistribution. You may reproduce and distribute copies of the Work or Derivative Works thereof in any medium, with or without modifications, and in Source or Object form, provided that You meet the following conditions: 

(a) You must give any other recipients of the Work or Derivative Works a copy of this License; and 

(b) You must cause any modified files to carry prominent notices stating that You changed the files; and 

(c) You must retain, in the Source form of any Derivative Works that You distribute, all copyright, patent, trademark, and attribution notices from the Source form of the Work, excluding those notices that do not pertain to any part of the Derivative Works; and 

(d) If the Work includes a “NOTICE” text file as part of its distribution, then any Derivative Works that You distribute must include a readable copy of the attribution notices contained within such NOTICE file, excluding those notices that do not pertain to any part of the Derivative Works, in at least one of the following places: within a NOTICE text file distributed as part of the Derivative Works; within the Source form or documentation, if provided along with the Derivative Works; or, within a display generated by the Derivative Works, if and wherever such third-party notices normally appear. The contents of the NOTICE file are for informational purposes only and do not modify the License. You may add Your own attribution notices within Derivative Works that You distribute, alongside or as an addendum to the NOTICE text from the Work, provided that such additional attribution notices cannot be construed as modifying the License. 

You may add Your own copyright statement to Your modifications and may provide additional or different license terms and conditions for use, reproduction, or distribution of Your modifications, or for any such Derivative Works as a whole, provided Your use, reproduction, and distribution of the Work otherwise complies with the conditions stated in this License. 

5\. Submission of Contributions. Unless You explicitly state otherwise, any Contribution intentionally submitted for inclusion in the Work by You to the Licensor shall be under  
the terms and conditions of this License, without any additional terms or conditions. Notwithstanding the above, nothing herein shall supersede or modify the terms of any separate license agreement you may have executed with Licensor regarding such Contributions. 

6\. Trademarks. This License does not grant permission to use the trade names, trademarks, service marks, or product names of the Licensor, except as required for reasonable and customary use in describing the origin of the Work and reproducing the content of the NOTICE file. 

7\. Disclaimer of Warranty. Unless required by applicable law or agreed to in writing, Licensor provides the Work (and each Contributor provides its Contributions) on an “AS IS” BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied, including, without limitation, any warranties or conditions of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A PARTICULAR PURPOSE. You are solely responsible for determining the appropriateness of using or redistributing the Work and assume any risks associated with Your exercise of permissions under this License. 

8\. Limitation of Liability. In no event and under no legal theory, whether in tort (including negligence), contract, or otherwise, unless required by applicable law (such as deliberate and grossly negligent acts) or agreed to in writing, shall any Contributor be liable to You for damages, including any direct, indirect, special, incidental, or consequential damages of any character arising as a result of this License or out of the use or inability to use the Work (including but not limited to damages for loss of goodwill, work stoppage, computer failure or malfunction, or any and all other commercial damages or losses), even if such Contributor has been advised of the possibility of such damages. 

9\. Accepting Warranty or Additional Liability. While redistributing the Work or Derivative Works thereof, You may choose to offer, and charge a fee for, acceptance of support, warranty, indemnity, or other liability obligations and/or rights consistent with this License. However, in accepting such obligations, You may act only on Your own behalf and on Your sole responsibility, not on behalf of any other Contributor, and only if You agree to indemnify, defend, and hold each Contributor harmless for any liability incurred by, or claims asserted against, such Contributor by reason of your accepting any such warranty or additional liability. 

END OF TERMS AND CONDITIONS 

APPENDIX: How to apply the Apache License to your work. 

 To apply the Apache License to your work, attach the following  boilerplate notice, with the fields enclosed by brackets "\[\]"  replaced with your own identifying information. (Don't include  the brackets\!) The text should be enclosed in the appropriate  comment syntax for the file format. We also recommend that a  file or class name and description of purpose be included on the  same "printed page" as the copyright notice for easier 

 identification within third-party archives.  
Copyright \[2020\] \[n8n GmbH\] 

Licensed under the Apache License, Version 2.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at 

 http://www.apache.org/licenses/LICENSE-2.0 

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an “AS IS” BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License. 

master-n8n-docs.md 

README.md 

![][image1]*Banner image* 

n8n Docs 

This repository hosts the documentation for n8n, an extendable workflow automation tool which enables you to connect anything to everything. The documentation is live at docs.n8n.io. 

Previewing and building the documentation locally 

Prerequisites 

∙ Python 3.8 or above 

∙ Pip 

∙ n8n recommends using a virtual environment when working with Python, such as venv. ∙ Follow the recommended configuration and auto-complete guidance for the theme. This will help when working with the mkdocs.yml file. 

∙ The repo includes a .editorconfig file. Make sure your local editor settings **do not override** these settings. In particular: 

o Don’t allow your editor to replace tabs with spaces. This can affect our code samples (which must retain tabs for people building nodes). 

o One tab must be equivalent to four spaces.  
Steps 

*For members of the n8n GitHub organization:* 

1\. Set up an SSH token and add it to your GitHub account. Refer to GitHub | About SSH for guidance. 

2\. Then run these commands: 

git clone \--recurse-submodules git@github.com:n8n-io/n8n-docs.git cd n8n-docs 

*\# Set up virtual environment if using one (steps depend on your system) \# Install dependencies* 

pip install \-r requirements.txt 

pip install \_submodules/insiders 

*For external contributors:* 

Rely on the preview builds on pull requests, or use the free version of Material for MkDocs (most things are the same, some formatting may be missing) 

Fork the repository, then: 

git clone https://github.com/\<your-username\>/n8n-docs.git 

cd n8n-docs 

pip install \-r requirements.txt 

pip install mkdocs-material 

*To serve a local preview:* 

mkdocs serve 

Contributing 

Please read the CONTRIBUTING guide. 

You can find style guidance in the wiki. 

Support 

If you have problems or questions, head to n8n’s forum: https://community.n8n.io License 

n8n-docs is fair-code licensed under the **Sustainable Use License**. 

More information about the license is available in the License documentation. .github\_TEMPLATE\_report.md   
**NOTE\!**  
This is for issues with *documentation* of **n8n**. If the problem you are having is actually a bug in the software, please file a bug here instead. 

**Where is the bug/mistake?** Please help us by pasting in the URL of the page or telling us the title. 

**What problem did you find?** A clear and concise description of what is wrong. 

**Can you suggest a fix?** For some issues, like a broken link, it will help us resolve them faster if you can indicate what you think the correct information would be. 

**Additional context** Add any other context about the problem here. 

.github\_TEMPLATE-docs-request.md 

Thanks for helping us improve docs\! Please give us as much information as you can about the changes you’d like to see. 

**What information is missing?** 

**Describe the page/pages you’d like** 

**Additional context** Add any other context or screenshots about the feature request here. archive.md 

AI environment variables 

–8\<– “\_snippets/self-hosting/file-based-configuration.md” 

Variable Type Default Description N8N\_AI\_ENABLED Boolean false Whether AI features are enabled (true) or not (false).   
Enables Ask AI for the HTTP   
node. 

N8N\_AI\_PROVIDER String openai The AI provider to use. Currently, n8n only supports 

OpenAI. 

N8N\_AI\_OPENAI\_API\_ KEY   
String \- Your OpenAI API key.  
archive-n8n-nodes-module.md 

Creating n8n-nodes-module 

\[TODO: this is the most up to date method, use it\] 

In this guide, you’ll learn to create a custom n8n-nodes-module that can be installed separately alongside your n8n instance. The n8n-nodes-module is an npm package that contains the node. Your custom node will get loaded automatically when n8n starts. 

Consider creating n8n-nodes-module if any of the following conditions satisfy your needs: \- The nodes are only for yourself, your organization, or a small group of people. \- The nodes require external dependencies that are not already available in n8n. 

**NOTE:** n8n-nodes-module can only be installed in self-hosted n8n instances. This functionality is currently not available on n8n Cloud or the desktop app. There are plans to introduce this functionality in the future. 

Prerequisites 

You may already be familiar with creating nodes in n8n. If you are unfamiliar with how to create n8n nodes, you can learn about it following the instructions mentioned in the Creating Your First Node tutorial. 

Install the following tools: 

∙ **Git:** You can find instructions on how to install Git here. 

∙ **Node.js and npm:** You can find instructions how to install both using nvm (Node Version Manager) here. The current minimum version is 14.15. In case you already have Node.js and npm installed, you can check the current version with the following command: bash node \-v npm \-v 

**NOTE:** Use node version 14.x and npm version 6.x. If using npm version 7+, you must enable legacy peer dependencies by setting: npm config set legacy-peer-deps true. 

\[TODO: remove lerna per alex\] 

∙ **Lerna:** You can install lerna globally with the following command: bash npm i ∙ Install n8n: Create a new folder and install n8n using the command: 

npm install n8n 

Create custom n8n-nodes-module 

You can create multiple n8n-nodes-modules. Each individual n8n-nodes-module should get created in a separate folder since they are different npm packages. A single n8n-nodes-module can contain multiple nodes. If you’re creating multiple nodes in the same module, as a best practice create each node in a separate folder.  
In this tutorial, you will create an n8n-nodes-module for the OpenWeatherMap API. You will name it ***n8n-nodes-weather***. 

To quickly get started, clone the example starter using the following command: git clone https://github.com/n8n-io/n8n-nodes-starter.git n8n-nodes-weather. 

After the repo gets cloned, open the package.json file, and update the value of the name by replacing n8n-nodes-starter with n8n-nodes-weather. 

**NOTE:** The name of the module has to start with n8n-nodes-. 

Open the cloned repository in your code editor, and create a new folder called Weather, inside the ***nodes*** folder. Create Weather.node.ts file inside the Weather folder and paste the following code: 

**import** { 

 IDataObject, 

 IExecuteFunctions, 

 INodeExecutionData, 

 INodeType, 

 INodeTypeDescription, 

 IRequestOptions, 

 NodeApiError, 

 NodeOperationError, 

} **from** 'n8n-workflow'; 

**export class** Weather **implements** INodeType { 

 description: INodeTypeDescription \= { 

 displayName: 'Weather', 

 name: 'Weather', 

 icon: 'fa:sun', 

 group: \['input'\], 

 version: 1, 

 description: 'Gets current and future weather information',  defaults: { 

 name: 'Weather', 

 color: '\#554455', 

 }, 

 inputs: \['main'\], 

 outputs: \['main'\], 

 credentials: \[ 

 { 

 name: 'weatherApi', 

 required: **true**, 

 }, 

 \], 

 properties: \[ 

 { 

 displayName: 'Operation', 

 name: 'operation',  
 type: 'options', 

 options: \[ 

 { 

 name: 'Current Weather', 

 value: 'currentWeather', 

 description: 'Returns the current weather data',  }, 

{ 

 name: '5 day Forecast', 

 value: '5DayForecast', 

 description: 'Returns the weather data for the next 5 days', 

 }, 

 \], 

 **default**: 'currentWeather', 

 description: 'The operation to perform.', 

 }, 

 { 

 displayName: 'Format', 

 name: 'format', 

 type: 'options', 

 options: \[ 

 { 

 name: 'Imperial', 

 value: 'imperial', 

 description: 'Fahrenheit | miles/hour',  }, 

{ 

 name: 'Metric', 

 value: 'metric', 

 description: 'Celsius | meter/sec',  }, 

{ 

 name: 'Scientific', 

 value: 'standard', 

 description: 'Kelvin | meter/sec',  }, 

 \], 

 **default**: 'metric', 

 description: 'The format in which format the data should be returned.', 

 }, 

 *// \----------------------------------* 

 *// Location Information* 

 *// \----------------------------------* 

 { 

 displayName: 'Location Selection', 

 name: 'locationSelection', 

 type: 'options',  
 options: \[ 

 { 

 name: 'City Name', 

 value: 'cityName', 

 }, 

{ 

 name: 'City ID', 

 value: 'cityId', 

 }, 

{ 

 name: 'Coordinates', 

 value: 'coordinates', 

 }, 

{ 

 name: 'Zip Code', 

 value: 'zipCode', 

 }, 

 \], 

 **default**: 'cityName', 

 description: 'How to define the location for which to return the weather.', 

 }, 

 { 

 displayName: 'City', 

 name: 'cityName', 

 type: 'string', 

 **default**: '', 

 placeholder: 'berlin,de', 

 required: **true**, 

 displayOptions: { 

 show: { 

 locationSelection: \[ 

 'cityName', 

 \], 

 }, 

 }, 

 description: 'The name of the city to return the weather of.', 

 }, 

 { 

 displayName: 'City ID', 

 name: 'cityId', 

 type: 'number', 

 **default**: 160001123, 

 required: **true**, 

 displayOptions: { 

 show: { 

 locationSelection: \[  
 'cityId', 

 \], 

 }, 

 }, 

 description: 'The id of city to return the weather of. List can be downloaded here: http://bulk.openweathermap.org/sample/',  }, 

 { 

 displayName: 'Latitude', 

 name: 'latitude', 

 type: 'string', 

 **default**: '', 

 placeholder: '13.39', 

 required: **true**, 

 displayOptions: { 

 show: { 

 locationSelection: \[ 

 'coordinates', 

 \], 

 }, 

 }, 

 description: 'The latitude of the location to return the weather of.', 

 }, 

 { 

 displayName: 'Longitude', 

 name: 'longitude', 

 type: 'string', 

 **default**: '', 

 placeholder: '52.52', 

 required: **true**, 

 displayOptions: { 

 show: { 

 locationSelection: \[ 

 'coordinates', 

 \], 

 }, 

 }, 

 description: 'The longitude of the location to return the weather of.', 

 }, 

 { 

 displayName: 'Zip Code', 

 name: 'zipCode', 

 type: 'string', 

 **default**: '', 

 placeholder: '10115,de',  
 required: **true**, 

 displayOptions: { 

 show: { 

 locationSelection: \[ 

 'zipCode', 

 \], 

 }, 

 }, 

 description: 'The id of city to return the weather of. List can be downloaded here: http://bulk.openweathermap.org/sample/',  }, 

 { 

 displayName: 'Language', 

 name: 'language', 

 type: 'string', 

 **default**: '', 

 placeholder: 'en', 

 required: **false**, 

 description: 'The two letter language code to get your output in (eg. en, de, ...).', 

 }, 

 \], 

 }; 

 **async** execute(**this**: IExecuteFunctions): Promise\<INodeExecutionData\[\]\[\]\> {  **const** items \= **this**.getInputData(); 

 **const** returnData: IDataObject\[\] \= \[\]; 

 **const** credentials \= **await this**.getCredentials('openWeatherMapApi'); 

 **if** (credentials \=== **undefined**) { 

 **throw new** NodeOperationError(**this**.getNode(), 'No credentials got returned\!'); 

 } 

 **const** operation \= **this**.getNodeParameter('operation', 0) **as** string; 

 **let** endpoint \= ''; 

 **let** locationSelection; 

 **let** language; 

 **let** qs: IDataObject; 

 **for** (**let** i \= 0; i \< items.length; i\++) { 

 **try** {  
 *// Set base data* 

 qs \= { 

 APPID: credentials.accessToken, 

 units: **this**.getNodeParameter('format', i) **as** string,  }; 

 *// Get the location* 

 locationSelection \= 

**this**.getNodeParameter('locationSelection', i) **as** string; 

 **if** (locationSelection \=== 'cityName') { 

 qs.q \= **this**.getNodeParameter('cityName', i) **as** string;  } **else if** (locationSelection \=== 'cityId') {  qs.id \= **this**.getNodeParameter('cityId', i) **as** number;  } **else if** (locationSelection \=== 'coordinates') {  qs.lat \= **this**.getNodeParameter('latitude', i) **as** string;  qs.lon \= **this**.getNodeParameter('longitude', i) **as** string;  } **else if** (locationSelection \=== 'zipCode') {  qs.zip \= **this**.getNodeParameter('zipCode', i) **as** string;  } **else** { 

 **throw new** NodeOperationError(**this**.getNode(), \`The locationSelection "${locationSelection}" is not known\!\`); 

 } 

 *// Get the language* 

 language \= **this**.getNodeParameter('language', i) **as** string;  **if** (language) { 

 qs.lang \= language; 

 } 

 **if** (operation \=== 'currentWeather') { 

 *// \----------------------------------* 

*// currentWeather* 

*// \----------------------------------* 

 endpoint \= 'weather'; 

 } **else if** (operation \=== '5DayForecast') {  *// \----------------------------------* 

*// 5DayForecast* 

*// \----------------------------------* 

 endpoint \= 'forecast'; 

 } **else** { 

 **throw new** NodeOperationError(**this**.getNode(), \`The operation "${operation}" is not known\!\`); 

 } 

 **const** options: IRequestOptions \= { 

 method: 'GET',  
 qs, 

uri: 

\`https://api.openweathermap.org/data/2.5/${endpoint}\`, 

 json: **true**, 

 }; 

 **let** responseData; 

 **try** { 

 responseData \= **await this**.helpers.request(options);  } **catch** (error) { 

 **throw new** NodeApiError(**this**.getNode(), error);  } 

 returnData.push(responseData **as** IDataObject); 

 } **catch** (error) { 

 **if** (**this**.continueOnFail()) { 

 returnData.push({json:{ error: error.message }});  **continue**; 

 } 

 **throw** error; 

 } 

 } 

 **return** \[**this**.helpers.returnJsonArray(returnData)\];  } 

} 

The OpenWeatherMap API requires credentials to return results successfully. Create WeatherApi.credentials.ts file in the ***Credentials*** folder and paste the following code: 

**import** { 

 ICredentialType, 

 INodeProperties, 

} **from** 'n8n-workflow'; 

**export class** WeatherApi **implements** ICredentialType { 

 name \= 'weatherApi'; 

 displayName \= 'Weather API'; 

 properties: INodeProperties\[\] \= \[ 

 { 

 displayName: 'Access Token', 

 name: 'accessToken', 

 type: 'string', 

 **default**: '', 

 }, 

 \]; 

}  
Add the newly created node and the credential to the package.json file. Add "dist/nodes/Weather/Weather.node.js" to the ***nodes*** array in the ***n8n*** object (n8n.nodes). Similarly, add "dist/credentials/WeatherApi.credentials.js" to the ***credentials*** array in the ***n8n*** object (n8n.credentials). 

Develop and test the module 

Once you’ve created the n8n-nodes-module, you need to build the code and publish the package locally to test it. Run the following commands: 

*\# Install dependencies* 

npm install 

*\# Build the code* 

npm run build 

*\# "Publish" the package locally* 

npm link 

**NOTE:** If you get permission errors, run the command as a root user with sudo, for example sudo npm link. 

In the terminal, open the folder where you installed n8n. Run the following command to install the locally published module. 

*\# "Install" the above locally published module* 

npm link n8n-nodes-weather 

Start n8n with the below command 

./node\_modules/n8n/bin/n8n start 

You will now be able to test and use your newly created n8n-nodes-module. Publish the n8n-nodes-module 

As mentioned, the n8n-nodes-module is an npm package. To make it available to others, you can publish it to the npm registry. Refer to the Publishing unscoped public packages guide to learn about publishing packages. 

Following the steps mentioned above, you can create multiple nodes within a single n8n-nodes module. You can also create nodes that require dependencies that are not present in n8n. When creating an n8n-nodes-module make sure that you follow the following guidelines: 

∙ The name of the module should start with n8n-nodes-. 

∙ The package.json file has to contain a key n8n with the paths to nodes and credentials. ∙ The module has to be installed alongside n8n.  
Use the n8n-nodes-module in production 

Once you test and publish your n8n-nodes-module you would want to use it in your production environment. 

If you’re running n8n via Docker, you will have to create a Docker image with the node module installed in n8n. Follow the steps below to create your Docker image: 

1\. Create a Dockerfile and paste the code from this Dockerfile. 

2\. Add the following command in your Dockerfile before the font installation command. **RUN** cd /usr/local/lib/node\_modules/n8n **&&** npm install n8n-nodes-weather Your Dockerfile should look like this: 

**FROM** node:16-alpine 

**ARG** N8N\_VERSION 

**RUN if** \[ \-z "$N8N\_VERSION" \] **; then** echo "The N8N\_VERSION argument is missing\!" **;** exit 1**; fi** 

*\# Update everything and install needed dependencies* 

**RUN** apk add \--update graphicsmagick tzdata git tini su-exec 

*\# Set a custom user to not have n8n run as root* 

**USER** root 

*\# Install n8n and the packages it needs to build it correctly.* **RUN** apk \--update add \--virtual build-dependencies python3 build-base ca-certificates **&&** \\ 

 npm config set python "$(which python3)" **&&** \\ 

 npm\_config\_user\=root npm install \-g full-icu n8n@${N8N\_VERSION} **&&** \\ 

 apk del build-dependencies \\ 

 **&&** rm \-rf /root /tmp/\* /var/cache/apk/\* **&&** mkdir /root**;** 

*\# Install your n8n-nodes-module. Replace \<n8n-nodes-module\> with the name of your module* 

**RUN** cd /usr/local/lib/node\_modules/n8n **&&** npm install \<n8n-nodes module\> 

*\# Install fonts* 

**RUN** apk \--no-cache add \--virtual fonts msttcorefonts-installer fontconfig **&&** \\ 

 update-ms-fonts **&&** \\ 

 fc-cache \-f **&&** \\ 

 apk del fonts **&&** \\ 

 find /usr/share/fonts/truetype/msttcorefonts/ \-type l \-exec unlink  
{} \\; \\ 

 **&&** rm \-rf /root /tmp/\* /var/cache/apk/\* **&&** mkdir /root **ENV** NODE\_ICU\_DATA /usr/local/lib/node\_modules/full-icu 

**WORKDIR** /data 

**COPY** docker-entrypoint.sh /docker-entrypoint.sh 

**ENTRYPOINT** \["tini", "--", "/docker-entrypoint.sh"\] 

**EXPOSE** 5678/tcp 

3\. Download the docker-entrypoint.sh file, and place it in the same directory as your Dockerfile. 

4\. Build your Docker image: 

*\# Replace \<n8n-version-number\> with the n8n release version number. \# For example, N8N\_VERSION=0.177.0* 

docker build \--build-arg N8N\_VERSION=\<n8n-version-number\> \-- tag=customizedn8n . 

You can now use your n8n-nodes-module in Docker. 

If you’re running either by installing it globally or using PM2, make sure that you install your n8n-nodes-module inside n8n. n8n will find the module and load it automatically. 

archive-trigger-node.md 

Creating Your First Trigger Node 

This tutorial walks through building a trigger node. 

Prerequisites 

You need the following installed on your development machine: 

–8\<– “\_snippets/integrations/creating-nodes/prerequisites.md” 

You need some understanding of: 

∙ JavaScript/TypeScript 

∙ REST APIs 

∙ Webhooks 

∙ Expressions in n8n 

∙ git  
Build your node 

The first thing that we have to do is pick the service we want to create the node for. We will use Autopilot as an example. 

Since n8n’s repository already has a Autopilot Trigger node, we will name this node **Autofriend Trigger** to avoid conflicts. 

Step 1: Set up the project 

–8\<– “\_snippets/integrations/creating-nodes/tutorial-set-up-project.md” 

Creating the node 

1\. Go to packages/nodes-base/nodes. 

2\. Create a folder called Autofriend (the folder names are PascalCase). 3\. Within the Autofriend folder, create a file called AutofriendTrigger.node.ts (YourNodeNameTrigger.node.ts). 

4\. Download and add the Autofriend icon to the folder. Name it autopilot.svg. o The icon property has to be either a 60x60 pixels PNG or an SVG and must exist in the node’s folder. 

o An SVG is preferable. In case you have to use a PNG, make sure that it’s compressed. A good tool for that’s tinypng. 

o A good place to find company icons is gilbarbara/logos. 

5\. Paste the following code in the AutofriendTrigger.node.ts file. 

**import** { 

 IDataObject, 

 IHookFunctions, 

 INodeType, 

 INodeTypeDescription, 

 IWebhookFunctions, 

 IWebhookResponseData, 

} **from** 'n8n-workflow'; 

*/\** 

*import {* 

 *autofriendApiRequest,* 

*} from './GenericFunctions';* 

*import {* 

 *snakeCase,* 

*} from 'change-case';* 

*\*/* 

**export class** AutofriendTrigger **implements** INodeType { 

 description: INodeTypeDescription \= { 

 displayName: 'Autofriend Trigger',  
 name: 'autofriendTrigger', 

 icon: 'file:autofriend.svg', 

 group: \['trigger'\], 

 version: 1, 

 subtitle: '={{$parameter\["event"\]}}', 

 description: 'Handle Autofriend events using webhooks',  defaults: { 

 name: 'Autofriend Trigger', 

 color: '\#6ad7b9', 

 }, 

 inputs: \[\], 

 outputs: \['main'\], 

 credentials: \[\], 

 webhooks: \[ 

 { 

 name: 'default', 

 httpMethod: 'POST', 

 responseMode: 'onReceived', 

 path: 'webhook', 

 }, 

 \], 

 properties: \[\], 

 }; 

 **async** webhook(**this**: IWebhookFunctions): Promise\<IWebhookResponseData\> {  **return** { 

 workflowData: \[\], 

 }; 

 } 

} 

Your directory structure should now look like the following. 

Autofriend’s directory structure 

*Autofriend’s directory structure* 

Adding the node to Editor UI 

n8n uses the properties set in the property description to render the node in the Editor UI. These properties are displayName, name, color, icon, description, and subtitle. 

Check the following figure to see how the properties affect the looks of the node. 

Autofriend’s appearance in Editor UI 

*Autofriend’s appearance in Editor UI* 

**Note:** The property description conforms to INodeTypeDescription. 

Let’s see how the node looks in the UI by following these steps: 

1\. Go to /packages/nodes-base/package.json.  
2\. Paste "dist/nodes/Autofriend/AutofriendTrigger.node.js", in the nodes array to register the node (in an alphabetical order). 

3\. Go to the project’s main folder (n8n) in the terminal and run the following commands (it can take a few minutes). 

o The first command installs all dependencies of all the modules and links them together. 

o The second command builds all the code. 

o The third command starts n8n in development mode. 

lerna bootstrap \--hoist 

npm run build 

npm run dev 

4\. Open your browser and go to localhost:8080 and you should be able to see the Editor UI. 5\. Open the ***Create Node*** menu, select the ***Trigger*** tab, type Autofriend, and click on it to add the node to the Editor UI. 

**Notes** 

∙ On startup, n8n will load all the nodes and credentials (more about credentials later) that are registered in /packages/nodes-base/package.json. 

∙ The property description.name uses camelCase. 

∙ The property description.color is the company’s branding color in hexadecimal. In case the website doesn’tinclude this information, there are other websites that help you get a company’s branding colors. For example, brandpalettes.com. 

Creating the UI for the node 

Double-clicking on the Autofriend Trigger node will open the Node Editor View. It will be empty since we haven’t added any UI components yet. Luckily, n8n provides predefined JSON based UI components that we can use to ask the user for different types of data. 

Autopilots’s docs mention that to create a hook, we need to provide the following pieces of information: 

∙ event \- Required 

∙ target\_url \- Required 

In the event parameter, we provide the name of the event for which we want to be notified. For example, contact\_added. As the name implies, by providing contact\_added as the event, we will be notified every time a contact is added to Autofriend. 

In the target\_url parameter, we provide the URL where Autofriend will notify us when the event defined in the event parameter takes place. We don’t need to ask the user for this parameter as n8n provides us with a method to obtain it.  
Adding the fields 

Let’s make the Node Editor View ask for these parameters: 1\. Add the following under description.properties in packages/nodes 

base/nodes/Autofriend/AutofriendTrigger.node.ts.. 

{ 

 displayName: 'Event', 

 name: 'event', 

 type: 'options', 

 required: **true**, 

 **default**: '', 

 options: \[ 

 { 

 name: 'Contact Added', 

 value: 'contactAdded', 

 }, 

 { 

 name: 'Contact Added To List', 

 value: 'contactAddedToList', 

 }, 

 { 

 name: 'Contact Entered Segment', 

 value: 'contactEnteredSegment', 

 }, 

 { 

 name: 'Contact Left Segment', 

 value: 'contactLeftSegment', 

 }, 

 { 

 name: 'Contact Removed From List', 

 value: 'contactRemovedFromList', 

 }, 

 { 

 name: 'Contact Unsubscribed', 

 value: 'contactUnsubscribed', 

 }, 

 { 

 name: 'Contact Updated', 

 value: 'contactUpdated', 

 }, 

 \], 

}, 

2\. Stop the current n8n process by pressing ctrl \+ c in the terminal in which you are running n8n. 

3\. Run again, by entering the following in the terminal. 

npm run dev 

4\. Go to localhost:8080, refresh the page, and open the node again.  
The node should now look like in the following image. 

Autofriend’s required fields 

*Autofriend’s required fields* 

Creating the UI for credentials 

Most REST APIs use some sort of authentication mechanism. Autofriend’s REST API uses API Keys. The API Key informs them about who is making the request to their system and gives you access to all the functionality that the API provides. Given all the things it can do, this has to be treated as a sensitive piece of information and should be kept private. 

n8n gives you the ability to ask for sensitive information using credentials. In the credentials, you can use all the generally available UI elements. Additionally, the data that’s stored using the credentials would be encrypted before being saved to the database. In order to do that, n8n uses an encryption key. 

With that in mind, let’s create the UI to ask for the user’s Autofriend API Key. The process of creating and registering credentials is similar to that of creating and registering the node: 

1\. Go to packages/nodes-base/credentials. 

2\. Within the credentials folder, create a file named AutofriendApi.credentials.ts. 3\. Paste the following code. 

**import** { 

 ICredentialType, 

 NodePropertyTypes, 

} **from** 'n8n-workflow'; 

**export class** AutofriendApi **implements** ICredentialType { 

 name \= 'autofriendApi'; 

 displayName \= 'Autofriend API'; 

 properties \= \[ 

 { 

 displayName: 'API Key', 

 name: 'apiKey', 

 type: 'string' **as** NodePropertyTypes, 

 **default**: '', 

 }, 

 \]; 

} 

4\. Go to /packages/nodes-base/package.json. 

5\. Paste "dist/credentials/AutofriendApi.credentials.js", in the credentials array to register the credentials (in an alphabetical order). 

6\. Got to packages/nodes-base/nodes/Autofriend/AutofriendTrigger.node.ts. 7\. Associate the credentials with the node by adding the following to   
description.credentials. 

credentials: \[ 

 {  
 name: 'autofriendApi', 

 required: **true**, 

 }, 

\], 

8\. Stop the current n8n process by pressing ctrl \+ c in the terminal in which you are running n8n. 

9\. Run again, by entering the following in the terminal. 

npm run dev 

When you go to the Node Editor view, you should see the following. 

Autofriend’s create credentials 

*Autofriend’s create credentials* 

Autofriend’s credentials 

*Autofriend’s credentials* 

Understanding the life cycle for the webhook method 

When a Trigger node is executed either in test or production mode, the following happens: n8n persists all the webhooks defined in description.webhooks 

The persisted data will be used later to verify if the incoming requests to the n8n’s webhook endpoint are valid. 

The property webhooks implements the interface **IWebhookDescription**. The interface has four properties. 

1\. **name:** The property name where n8n will look for the life cycle methods. 2\. **httpMethod:** The HTTP method. 

3\. **responseMode:** When the trigger will respond. When developing a trigger node, this property must be set to onReceived. 

4\. **path:** The path added to the base URL. 

For example, for a Trigger node with the following webhooks property, n8n will create the following webhooks URLs. 

webhooks: \[ 

 { 

 name: 'default', 

 httpMethod: 'POST', 

 responseMethod: 'onReceived', 

 path: 'webhook', 

 }, 

\] 

∙ **Test:** POST {{WEBHOOK\_URL || localhost}}/webhook-test/{{uuid}}/{{path}} ∙ **Production:** POST {{WEBHOOK\_URL || localhost}}/webhook/{{uuid}}/{{path}}  
These URLs can be found in the node under the Webhook URLs label. 

These webhook URLs will be used as the notification URL (also known as the callback URL or target URL) when creating the webhook in the external system. 

**Note:** In test mode, the webhooks are persisted in memory. In production mode, they are persisted in the database. 

n8n executes the life cycle methods 

The life cycle methods allow us to create, delete, and check if the webhook exists in the external system. 

**Methods** 

∙ checkExist: This is the first method that gets called. It checks if the webhook with the current path is already registered in the external system or not. If the webhook is already registered, n8n persists the webhook ID. If the webhook isn’t registered with the external system, the create method gets executed. 

∙ create: This method gets called if the checkExist method returns false (if the webhook with the current path doesn’texist in the external system). This method registers the webhook in the external system and stores the webhook ID in n8n. 

∙ delete: This method gets called when the trigger is either stopped manually or when the workflow is deactivated. It uses the ID previously persisted by either the create or the checkExist method to delete the webhook from the external system. 

Lifecycle flowchart 

*Lifecycle flowchart* 

Wait for new events to trigger the workflow 

Every time the external system notifies us about a change, by making an HTTP Request to the URL we previously registered in the create method, the execute method is called. Within this method, we have access to the request object and everything it contains. For example, body, headers, querystring, etc. The data the method returns is the data we want the rest of the workflow to have access to. 

Let’s see how this would look for our current use-case: 

1\. Go to packages/nodes-base/nodes/Autofriend, create a file named GenericFunctions.ts, and paste the following code. 

**import** { 

 IDataObject, 

 IExecuteFunctions, 

 IHookFunctions, 

 ILoadOptionsFunctions, 

 IRequestOptions, 

 IWebhookFunctions, 

} **from** 'n8n-workflow';  
**export async function** autofriendApiRequest(this: IExecuteFunctions | IWebhookFunctions | IHookFunctions | ILoadOptionsFunctions, method: string, resource: string, body: any \= {}, query: IDataObject \= {}, uri?: string, option: IDataObject \= {}): Promise\<any\> { *// tslint:disable-line:no-any* 

 **const** credentials \= **await this**.getCredentials('autofriendApi') **as** IDataObject; 

 **const** apiKey \= credentials.apiKey; 

 **const** endpoint \= 'https://api2.autopilothq.com/v1'; 

 **const** options: IRequestOptions \= { 

 headers: { 

 'Content-Type': 'application/json', 

 autopilotapikey: apiKey, 

 }, 

 method, 

 body, 

 qs: query, 

 uri: uri || \`${endpoint}${resource}\`, 

 json: **true**, 

 }; 

 **if** (\!Object.keys(body).length) { 

 **delete** options.body; 

 } 

 **if** (\!Object.keys(query).length) { 

 **delete** options.qs; 

 } 

 **try** { 

 **return await this**.helpers.request\!(options); 

 } **catch** (error) { 

 **if** (error.response) { 

 **const** errorMessage \= error.response.body.message || error.response.body.description || error.message; 

 **throw new** Error(\`Autopilot error response \[${error.statusCode}\]: ${errorMessage}\`); 

 } 

 **throw** error; 

 } 

} 

2\. Go to packages/nodes-base/nodes/AutofriendTrigger.node.ts and add the following code after the property description. 

*// @ts-ignore* 

webhookMethods \= { 

 **default**: { 

 **async** checkExists(**this**: IHookFunctions): Promise\<boolean\> {  
 **const** webhookData \= **this**.getWorkflowStaticData('node');  **const** webhookUrl \= **this**.getNodeWebhookUrl('default');  **const** event \= **this**.getNodeParameter('event') **as** string;  **const** { hooks: webhooks } \= **await** autofriendApiRequest.call(**this**, 'GET', '/hooks'); 

 **for** (**const** webhook **of** webhooks) { 

 **if** (webhook.target\_url \=== webhookUrl && webhook.event \=== snakeCase(event)) { 

 webhookData.webhookId \= webhook.hook\_id;  **return true**; 

 } 

 } 

 **return false**; 

 }, 

 **async** create(**this**: IHookFunctions): Promise\<boolean\> {  **const** webhookUrl \= **this**.getNodeWebhookUrl('default');  **const** webhookData \= **this**.getWorkflowStaticData('node');  **const** event \= **this**.getNodeParameter('event') **as** string;  **const** body: IDataObject \= { 

 event: snakeCase(event), 

 target\_url: webhookUrl, 

 }; 

 **const** webhook \= **await** autofriendApiRequest.call(**this**, 'POST', '/hook', body); 

 webhookData.webhookId \= webhook.hook\_id; 

 **return true**; 

 }, 

 **async delete**(**this**: IHookFunctions): Promise\<boolean\> {  **const** webhookData \= **this**.getWorkflowStaticData('node');  **try** { 

 **await** autofriendApiRequest.call(**this**, 'DELETE', \`/hook/${webhookData.webhookId}\`); 

 } **catch** (error) { 

 **return false**; 

 } 

 **delete** webhookData.webhookId; 

 **return true**; 

 }, 

 }, 

}; 

} 

3\. Replace the webhook function with the following. 

**async** webhook(this: IWebhookFunctions): Promise\<IWebhookResponseData\> {  **const** req \= **this**.getRequestObject(); 

 **return** { 

 workflowData: \[ 

 **this**.helpers.returnJsonArray(req.body), 

 \], 

};  
4\. In the same file, uncomment the code snippet on the top to import   
autoFriendApiRequest and snakeCase. 

5\. Stop the current n8n process by pressing ctrl \+ c in the terminal where you are running n8n. 

6\. Run the project using a tunnel by entering ./packages/cli/bin/n8n start \--tunnel in the terminal. Access the n8n Editor UI at localhost:5678. 

7\. Enter the API key in the credentials. Instructions to find the API Key can be found here. 8\. Go to the workflow editor, save your workflow, and execute the node. Executed node   
*Executed node* 

9\. Log into Autopilot and update a contact. Keep in mind that this should be done within two minutes after you executed the node. After that time frame, the webhook will be unregistered automatically and you will not be able to receive the event. If it takes you longer than that, please execute the node and update the contact again. 

Executed node with results 

*Executed node with results* 

The trigger node is now receiving events. Sometimes it might take a bit longer for the payload to arrive. 

You probably noticed that this time we did not run the project using npm run dev, but instead using ./packages/cli/bin/n8n start \--tunnel. 

Since our server is running locally, we need a tool that lets us proxy all requests to our local machine so that n8n receives and handles the events from the external service (Autopilot). This gets achieved using a tunnel. The details on how a tunnel works are out of the scope of this tutorial. If you want to know about it, you can check this link. Keep in mind that the tunnel is meant for development purposes only and shouldn’t be used in production. 

Test your node 

–8\<– “\_snippets/integrations/creating-nodes/testing.md” 

Next steps 

∙ Deploy your node. 

∙ View an example of a declarative node: n8n’s Brevo node{:target=\_blank .external-link}. Note that the main node is declarative, while the trigger node is in programmatic style. ∙ Learn about node versioning. 

\# archive 

.md  
$item(index: number, runIndex?: number) 

With $item you can access the data of parent nodes. That can be the item data but also the parameters. It expects as input an index of the item the data should be returned for. This is needed because for each item the data returned can be different. This is probably straightforward for the item data itself but maybe less for data like parameters. The reason why it is also needed, is that they may contain an expression. Expressions get always executed of the context for an item. If that would not be the case, for example, the Email Send node not would be able to send multiple emails at once to different people. Instead, the same person would receive multiple emails. 

The index is 0 based. So $item(0) will return the first item, $item(1) the second one, and so on. 

By default the item of the last run of the node will be returned. So if the referenced node ran 3x (its last runIndex is 2\) and the current node runs the first time (its runIndex is 0\) the data of runIndex 2 of the referenced node will be returned. 

For more information about what data can be accessed via $node, check out the Variable: $node section. 

Example: 

*// Returns the value of the JSON data property "myNumber" of Node "Set" (first item)* 

**const** myNumber \= $item(0).$node\["Set"\].json\["myNumber"\]; 

*// Like above but data of the 6th item* 

**const** myNumber \= $item(5).$node\["Set"\].json\["myNumber"\]; 

*// Returns the value of the parameter "channel" of Node "Slack". // If it contains an expression the value will be resolved with the // data of the first item.* 

**const** channel \= $item(0).$node\["Slack"\].parameter\["channel"\]; *// Like above but resolved with the value of the 10th item.* **const** channel \= $item(9).$node\["Slack"\].parameter\["channel"\]; 

archive8n-nodes-base.cron.md 

Cron 

The Cron node is useful to schedule the workflows to run periodically at fixed dates, times, or intervals. This works in a similar way to the cron software utility in Unix-like systems. This core node is a Trigger node. 

/// note | Keep in mind 1\. If a workflow is using the Cron node as a trigger, make sure that you save and activate the workflow. /// 2\. Make sure that the timezone is set correctly for the n8n instance (or the workflow).  
Node Reference 

You can configure the node by clicking on the *Add Cron Time* button under the *Trigger Times* section. There are a couple of different options available for the *Mode* field in the form of a dropdownlist. 

∙ Mode 

o Every Minute 

o Every Hour 

o Every Day 

o Every Week 

o Every Month 

o Every X 

o Custom 

The ‘Every X’ option allows you to specify the workflow to be triggered every x minutes or hours. You can specify x by entering a number in the *Value* field. The ‘Custom’ option allows you to enter a custom cron expression in the *Cron Expression* field. 

FAQs 

How to generate a custom Cron expression? 

To generate a Cron expression, you can use crontab guru. Paste the Cron expression that you generated using crontab guru in the ***Cron Expression*** field in n8n. 

Why there are six asterisks (\*) in the Cron Expression? 

The sixth asterisk in the Cron Expression represents seconds. Setting this is optional. The node will execute even if you don’t set the value for seconds. 

\* \* \* \* \* \* 

second minute hour day week month 

If you want to trigger your workflow, for example, every day at 04:08:30, enter the following in the ***Cron Expression*** field. 

30 8 4 \* \* \* 

If you want to trigger your workflow, for example, every day at 04:08, enter the following in the ***Cron Expression*** field. 

8 4 \* \* \*  
archive8n-nodes-base.function.md 

Function 

/// warning | Deprecated in 0.198.0 n8n deprecated this node in version 0.198.0. Older workflows continue to work, and the node is still available in older versions n8n. From 0.198.0, n8n replaces the Function node with the Code node. /// Using the function node, you can: 

∙ Transform data from other nodes 

∙ Implement custom functionality 

/// note | Function node and function item node Note that the Function node is different from the Function Item node. Refer to Data | Code to learn about the difference between the two. /// 

The Function node supports: 

∙ Promises. Instead of returning the items directly, you can return a promise which resolves accordingly. 

∙ Writing to your browser console using console.log. This is useful for debugging and troubleshooting your workflows. 

When working with the Function node, you need to understand the following concepts: 

∙ Data structure: understand the data you receive in the Function node, and requirements for outputting data from the node. 

∙ Item linking: learn how data items work. You need to handle item linking when the number of input and output items doesn’t match. 

n8n provides built-in methods and variables. These provide support for: 

∙ Accessing specific item data 

∙ Accessing data about workflows, executions, and your n8n environment ∙ Convenience variables to help with data and time 

Refer to methods and variables for more information. 

Output items 

When using the Function node, you must return data in the format described in data structure. This example creates 10 items with the IDs 0 to 9: 

**const** newItems \= \[\]; 

**for** (**let** i\=0;i\<10;i\++) { 

 newItems.push({ 

 json: { 

 id: i 

 }  
 }); 

} 

**return** newItems; 

Manage item linking 

–8\<– “\_snippets/data/data-mapping/item-linking-code-node.md” 

External libraries 

If you self-host n8n, you can import and use built-in and external npm modules in the Function node. To learn how to enable external modules, refer the Configuration guide. 

archive8n-nodes-base.functionItem.md 

Function Item 

/// warning | Deprecated in 0.198.0 n8n deprecated this node in version 0.198.0. Older workflows continue to work, and the node is still available in older versions n8n. From 0.198.0, n8n replaces the Function node with the Code node. /// The Function Item node is used to add custom snippets to JavaScript code that should be executed once for every item that it receives as the input. 

/// note | Keep in mind Please note that the Function Item node is different from the Function node. Check out this page to learn about the difference between the two. /// 

The Function Item node supports promises. So instead of returning the items directly, it is also possible to return a promise which resolves accordingly. 

It also provides the ability to write to your browser console using console.log, useful for debugging and troubleshooting your workflows. 

Node Reference 

You can also use the methods and variables mentioned in the Expressions page in the Function Item node. 

Variable: item 

It contains the “json” data of the currently processed item. 

The data can be accessed and manipulated like this: 

**// Uses the data of an already existing key to create a new additional one item.newIncrementedCounter \= item.existingCounter \+ 1;** 

**return item;**  
Method: getBinaryData() 

Returns all the binary data (all keys) of the item which gets currently processed. 

**item.filename \= getBinaryData().attachment\_0.fileName;** 

**return item;** 

Method: setBinaryData(binaryData) 

Sets all the binary data (all keys) of the item which gets currently processed. Method: getWorkflowStaticData(type) 

This gives access to the static workflow data. It is possible to save data directly with the workflow. This data should, however, be very small. A common use case is to for example to save a timestamp of the last item that got processed from an RSS-Feed or database. It will always return an object. Properties can then read, delete or set on that object. When the workflow execution succeeds, n8n will check automatically if the data has changed and will save it, if necessary. 

There are two types of static data. The “global” and the “node” one. Global static data is the same in the whole workflow. And every node in the workflow can access it. The node static data, however, is different for every node and only the node which set it can retrieve it again. 

**Note:** The static data cannot be read and written when executing via manual executions. The data will always be empty, and the changes will not persist. The static data will only be saved when a workflow is active. 

*Example* 

*// Get the global workflow static data* 

**const** staticData \= getWorkflowStaticData('global'); 

*// Get the static data of the node* 

**const** staticData \= getWorkflowStaticData('node'); 

*// Access its data* 

**const** lastExecution \= staticData.lastExecution; 

*// Update its data* 

staticData.lastExecution \= **new** Date().getTime(); 

*// Delete data* 

**delete** staticData.lastExecution; 

External libraries 

You can import and use built-in and external npm modules in the Function Item node. To learn how to enable external modules, refer the Configuration guide.  
archive8n-nodes   
base.venafitlsprotectdatacentertrigger.md 

Venafi TLS Protect Datacenter Trigger 

Venafi{:target=\_blank .external-link} is a cybersecurity company providing services for machine identity management. They offer solutions to manage and protect identities for a wide range of machine types, delivering global visibility, lifecycle automation, and actionable intelligence. 

/// note | Credentials You can find authentication information for this node here. /// archive8n-nodes-langchain.chainretrievalqa.md 

Retrieval QA Chain 

The Retrieval QA Chain node allows you to answer a query based on document content indexed by a retriever. 

On this page, you’ll find the node parameters for the Retrieval QA Chain node, and links to more resources. 

/// note | Examples and templates For usage examples and templates to help you get started, refer to n8n’s LangChain integrations{:target=\_blank .external-link} page. /// \#\# Node parameters 

Query 

This is the prompt that the model will use. 

What can you tell me about {{ $json.input }} 

Choose a mode 

There are two modes: 

∙ **Run Once for All Items**: this is the default. When your workflow runs, the chain will run once, regardless of how many input items there are. 

∙ **Run Once for Each Item**: choose this if you want your chain to run for every input item. Related resources 

View example workflows and related content{:target=\_blank .external-link} on n8n’s website. 

Refer to LangChain’s documentation on Retrieval QA{:target=\_blank .external-link} for more information about the service. 

–8\<– “\_snippets/integrations/builtin/cluster-nodes/langchain-overview-link.md”  
archive8n-nodes-langchain.retrievervectorstore.md 

*Name* 

On this page, you’ll find the node parameters for the *Name* node, and links to more resources. 

/// note | Credentials You can find authentication information for this node here. /// /// note | Examples and templates For usage examples and templates to help you get started, refer to n8n’s LangChain integrations{:target=\_blank .external-link} page. /// \#\# Node parameters 

∙ *Bullet list* 

∙ *Of available operations*. 

Related resources 

View example workflows and related content{:target=\_blank .external-link} on n8n’s website. 

Refer to *Name*’s documentation{:target=\_blank .external-link} for more information about the service. 

–8\<– “\_snippets/integrations/builtin/cluster-nodes/langchain-overview-link.md” archive-developer-cli.md 

Using the Node Dev CLI 

Using the Node Dev CLI makes sense if you do not want to ever share the node that you create. For example, for internal systems or something very specific to your internal tooling. Also, the CLI only works if there are no additional dependencies required by the node as it does not support installing additional node modules. 

If that is not the case, it is best to do follow the creating your first node tutorial or create your own custom node-package. 

Create the first basic node 

1\. Install the n8n-node-dev CLI: npm install \-g n8n-node-dev 

2\. Create and go into the newly created folder in which you want to keep the code of the node 

3\. Use CLI to create boilerplate node code: n8n-node-dev new 

4\. Answer the questions (the â€œExecuteâ€ node type is the regular node type that you probably want to create). It will then create the node in the current folder. 5\. Programâ€¦ Add the functionality to the node 

6\. Build the node and copy to correct location: n8n-node-dev build That command will build the JavaScript version of the node from the TypeScript code and copy it to the user folder where custom nodes get read from \~/.n8n/custom/  
7\. Restart n8n and refresh the window so that the new node gets displayed Create own custom n8n-nodes-module 

If you want to create multiple custom nodes which are either: 

∙ Only for yourself/your company 

∙ Are only useful for a small number of people 

∙ Require many or large dependencies 

\!\!\! note To learn how to develop and test n8n-nodes-module, refer to the Create n8n-nodes module documentation. 

It is best to create your own n8n-nodes-module which can be installed separately. That is an npm package that contains the nodes and is set up in a way that n8n can automatically find and load them on startup. 

When creating such a module the following rules have to be followed that n8n can automatically find the nodes in the module: 

∙ The name of the module has to start with n8n-nodes- 

∙ The package.json file has to contain a key n8n with the paths to nodes and credentials ∙ The module has to be installed alongside n8n 

An example starter module which contains one node and credentials and implements the above can be found here: 

https://github.com/n8n-io/n8n-nodes-starter 

Setup to use n8n-nodes-module 

To use a custom n8n-nodes-module, it needs to be installed alongside n8n. For example like this: 

*\# Create folder for n8n installation* 

mkdir my-n8n 

cd my-n8n 

*\# Install n8n* 

npm install n8n 

*\# Install custom nodes module* 

npm install n8n-nodes-my-custom-nodes 

*\# Start n8n* 

n8n 

Development/Testing of custom n8n-nodes-module 

This works in the same way as for any other npm module.  
Execute in the folder which contains the code of the custom n8n-nodes-module which should be loaded with n8n: 

*\# Build the code* 

npm run build 

*\# "Publish" the package locally* 

npm link 

Then in the folder in which n8n is installed: 

*\# "Install" the above locally published module* 

npm link n8n-nodes-my-custom-nodes 

*\# Start n8n* 

n8n 

archive-flow-logic.md 

\[TODO: I’m not sure this page is helpful, especially if focused on a dev audience\] Plan your workflow logic   
When you build a workflow, you create a set of instructions for how to process data. This can include: 

∙ Accessing external applications to retrieve and export data. 

∙ Manipulating data. 

∙ Performing different actions based on the data. 

To define your data process, you link nodes together in a sequence. This is your workflow logic. n8n supports complex logic. 

/// Details | What is data? In n8n, data is any information processed by the workflow. n8n formats data as JSON. Refer to Data for more information on the data structure, and working with n8n workflow data. /// \#\# Fetch data 

Your workflow needs data. There are three main ways to get this data: 

∙ From the trigger node that starts the workflow. For example, if you use the Gmail trigger to start a workflow in response to an event in Gmail, the Gmail trigger node provides data about the event. 

∙ Using an app node to retrieve data. For example, you can use the Gmail node to fetch information from Gmail (after starting the workflow with a different trigger). ∙ Generate the data within the workflow. For example, you can use the Code node to create data.  
Manipulate data 

archive-checklist.md 

Node review checklist 

This checklist helps you build a node that meets the standards for submission to the community nodes collection. It also helps ensure that nodes are consistent and good quality. 

Preparation 

Set up your editor for code formatting (indentation, new lines, linting). If you use Visual Studio Code, you can use the TSLint extension{:target=\_blank .external-link} for linting. Get credentials (for example, Client ID, Client Secret, API key, user login, user password, website URL) for the service you are building a node for. 

Development 

If you’re creating a node requested by a community member, make sure to comment on the feature request in the community forum{:target=\_blank .external-link}. Add complementary operations to each resource (for example, create, delete) Programmatic-style only. Check the 

node works with more than one input item. Ensure the parameters have the correct type. Mind the defaults: if the service has a default as true, keep it as true. Changing default values can break the existing workflows of the users. Check if the node disposes of everything. In particular, the node has closed all connections. Check your code using the node linter. 

Testing 

Test “create” and “update” operations with all fields/operations. Test the continueOnFail option with a Function node. For example, a Widget node has a GET operation that takes a widgetId and returns information on the widget. To test that the workflow continues on fail, set the Widget node to continue on fail, create a Function node, return a valid and an invalid widgetId, connect the Function node to Widget node, and run the workflow. The Widget node should show two items: one with information on the widget and another one with the error from having passed an invalid ID.) 

Code formatting 

Ensure the package lints cleanly by running npm run lint. Ensure the indentation is correct. Check this in the editor configuration. Ensure there are no extra spaces. Check this in the editor configuration. Code comment dividers inside if-branches. Use “create/delete” verbs for operations, except for tags, where you should use “add/remove.”  
Errors and outputs 

Ensure empty API responses return { success: true }. Ensure the node handles and displays error responses (for example, malformed requests, requests with invalid credentials) and use the current format. You can check this by making failing requests to the API. Check if you can simplify the response. If so, add a simplify function (for example, SecurityScorecard node{:target=\_blank .external-link}). Ensure the response from Create is consistent with Get.  Ensure the response from Get All is consistent with Get. 

Presentation 

The primary menu shouldn’t contain optional parameters. Ensure a JSON object isn’t shown in a single column in Table view. Make sure all GetAll operations have the fields return and limit. Set the property subtitle. Make sure the pagination (if any) is working. Set Limit 1\. 

Writing 

Ensure all descriptions are correct and end with a period. Ensure that most descriptions exist, excluding redundant ones. Capitalize IDs in displayNames (for example: “IDs” not “ids” or “Ids”). If there is more than one ID, ensure they have descriptive qualifiers. Ensure the name property in description in the node class is in camelCase. Ensure the file name and the class name are identical. 

Branding 

Check that brand names are correct (for example, “GitHub” not “Github”). If the node is a trigger node, show this in the name by adding “Trigger” after the service name (for example, “Trello Trigger”). Ensure the logo is either a PNG or SVG, ideally the latter. Vecta{:target=\_blank .external-link} is a good website to find SVGs of different applications. If the logo is an SVG, ensure the canvas is a perfect square. If the logo is PNG, ensure it’s 60x60 pixels and compressed. Ensure the border color of the node matches the branding of the service. 

Nice-to-haves (optional) 

Add handler for continueOnFail. This handler continues the workflow even if the node’s execution fails. Remove required: false and description: '' in the node descriptions (for example, Lemlist node{:target=\_blank .external-link}). At call site, specify first body and then qs. At call site, prepend the endpoint with slash / (for example, “/campaign”). 

archive-icon-square-nodes-list.md 

–8\<– “\_snippets/node-icon-square/core-nodes/compression.html” –8\<– “\_snippets/node-icon square/core-nodes/cron.html” –8\<– “\_snippets/node-icon-square/core-nodes/crypto.html” –8\<– “\_snippets/node-icon-square/core-nodes/date-and-time.html” –8\<– “\_snippets/node-icon square/core-nodes/edit-image.html” –8\<– “\_snippets/node-icon-square/core-nodes/error trigger.html” –8\<– “\_snippets/node-icon-square/core-nodes/execute-command.html” –8\<– “\_snippets/node-icon-square/core-nodes/execute-workflow.html” –8\<– “\_snippets/node-icon-  
square/core-nodes/function-item.html” –8\<– “\_snippets/node-icon-square/core nodes/function.html” –8\<– “\_snippets/node-icon-square/core-nodes/git.html” –8\<– “\_snippets/node-icon-square/core-nodes/html-extract.html” –8\<– “\_snippets/node-icon square/core-nodes/http-request.html” –8\<– “\_snippets/node-icon-square/core nodes/icalendar.html” –8\<– “\_snippets/node-icon-square/core-nodes/n8n-nodes-base.if.html” – 8\<– “\_snippets/node-icon-square/core-nodes/imap-email.html” –8\<– “\_snippets/node-icon square/core-nodes/interval.html” –8\<– “\_snippets/node-icon-square/core-nodes/item-lists.html” –8\<– “\_snippets/node-icon-square/core-nodes/local-file-trigger.html” –8\<– “\_snippets/node icon-square/core-nodes/merge.html” –8\<– “\_snippets/node-icon-square/core-nodes/move binary-data.html” –8\<– “\_snippets/node-icon-square/core-nodes/n8n-trigger.html” –8\<– “\_snippets/node-icon-square/core-nodes/no-operation-do-nothing.html” –8\<– “\_snippets/node icon-square/core-nodes/read-binary-file.html” –8\<– “\_snippets/node-icon-square/core nodes/read-binary-files.html” –8\<– “\_snippets/node-icon-square/core-nodes/read-pdf.html” –8\<– “\_snippets/node-icon-square/core-nodes/rename-keys.html” –8\<– “\_snippets/node-icon square/core-nodes/respond-to-webhook.html” –8\<– “\_snippets/node-icon-square/core-nodes/rss read.html” –8\<– “\_snippets/node-icon-square/core-nodes/send-email.html” –8\<– “\_snippets/node-icon-square/core-nodes/set.html” –8\<– “\_snippets/node-icon-square/core nodes/split-in-batches.html” –8\<– “\_snippets/node-icon-square/core-nodes/spreadsheet file.html” –8\<– “\_snippets/node-icon-square/core-nodes/sse-trigger.html” –8\<– “\_snippets/node icon-square/core-nodes/ssh.html” –8\<– “\_snippets/node-icon-square/core-nodes/start.html” –8\<– “\_snippets/node-icon-square/core-nodes/stop-and-error.html” –8\<– “\_snippets/node-icon square/core-nodes/switch.html” –8\<– “\_snippets/node-icon-square/core-nodes/wait.html” –8\<– “\_snippets/node-icon-square/core-nodes/webhook.html” –8\<– “\_snippets/node-icon-square/core nodes/workflow-trigger.html” –8\<– “\_snippets/node-icon-square/core-nodes/write-binary file.html” –8\<– “\_snippets/node-icon-square/core-nodes/xml.html” 

docs\\1-0-migration-checklist.md 

n8n v1.0 migration guide 

This document provides a summary of what you should be aware of before updating to version 1.0 of n8n. 

The release of n8n 1.0 marks a milestone in n8n’s journey to make n8n available for demanding production environments. Version 1.0 represents the hard work invested over the last four years to make n8n the most accessible, powerful, and versatile automation tool. n8n 1.0 is now ready for use in production. 

New features 

Python support in the Code node 

Although JavaScript remains the default language, you can now also select Python as an option in the Code node and even make use of many Python modules{:target=\_blank .external link}. Note that Python is unavailable in Code nodes added to a workflow before v1.0.  
PR \#4295{:target=\_blank .external link}, PR \#6209{:target=\_blank .external link} Execution order 

n8n 1.0 introduces a new execution order for multi-branch workflows: 

In multi-branch workflows, n8n needs to determine the order in which to execute nodes on branches. Previously, n8n executed the first node of each branch, then the second of each branch, and so on (breadth-first). The new execution order ensures that each branch executes completely before starting the next one (depth-first). Branches execute based on their position on the canvas, from top to bottom. If two branches are at the same height, the leftmost one executes first. 

n8n used to execute multi-input nodes as long as they received data on their first input. Nodes connected to the second input of multi-input nodes automatically executed regardless of whether they received data. The new execution order introduced in n8n 1.0 simplifies this behavior: Nodes are now executed only when they receive data, and multi-input nodes require data on at least one of their inputs to execute. 

Your existing workflows will use the legacy order, while new workflows will execute using the v1 order. You can configure the execution order for each workflow in workflow settings. 

PR \#4238{:target=\_blank .external link}, PR \#6246{:target=\_blank .external link}, PR \#6507{:target=\_blank .external link} 

Deprecations 

MySQL and MariaDB 

n8n has removed support for MySQL and MariaDB as storage backends for n8n. These database systems are used by only a few users, yet they require continuous development and maintenance efforts. n8n recommends migrating to PostgreSQL for better compatibility and long-term support. 

PR \#6189{:target=\_blank .external link} 

EXECUTIONS\_PROCESS and “own” mode 

Previously, you could use the EXECUTIONS\_PROCESS environment variable to specify whether executions should run in the main process or in their own processes. This option and own mode are now deprecated and will be removed in a future version of n8n. This is because it led to increased code complexity while offering marginal benefits. Starting from n8n 1.0, main will be the new default. 

Note that executions start much faster in main mode than in own mode. However, if a workflow consumes more memory than is available, it might crash the entire n8n application instead of just the worker thread. To mitigate this, make sure to allocate enough system resources or configure queue mode to distribute executions among multiple workers. 

PR \#6196{:target=\_blank .external link}  
Breaking changes 

Docker 

*Permissions change* 

When using Docker-based deployments, the n8n process is now run by the user node instead of root. This change increases security. 

If permission errors appear in your n8n container logs when starting n8n, you may need to update the permissions by executing the following command on the Docker host: 

docker run \--rm \-it \--user root \-v \~/.n8n:/home/node/.n8n \--entrypoint chown n8nio/base:16 \-R node:node /home/node/.n8n 

*Image removal* 

We’ve removed the Debian and RHEL images. If you were using these you need to change the image you use. This shouldn’t result in any errors unless you were making a custom image based on one of those images. 

*Entrypoint change* 

The entrypoint for the container has changed and you no longer need to specify the n8n command. If you were previously running n8n worker \--concurrency=5 it’s now worker \-- concurrency=5 

PR \#6365{:target=\_blank .external link} 

Workflow failures due to expression errors 

Workflow executions may fail due to syntax or runtime errors in expressions, such as those that reference non-existent nodes. While expressions already throw errors on the frontend, this change ensures that n8n also throws errors on the backend, where they were previously silently ignored. To receive notifications of failing workflows, n8n recommends setting up an “error workflow” under workflow settings. 

PR \#6352{:target=\_blank .external link} 

Mandatory owner account 

This change makes User Management mandatory and removes support for other authentication methods, such as BasicAuth and External JWT. Note that the number of permitted users on n8n.cloud{:target=\_blank .external link} or custom plans still varies depending on your subscription. 

PR \#6362{:target=\_blank .external link} 

Directory for installing custom nodes 

n8n will no longer load custom nodes from its global node\_modules directory. Instead, you must install (or link) them to \~/.n8n/custom (or a directory defined by N8N\_CUSTOM\_EXTENSIONS).  
Custom nodes that are npm packages will be located in \~/.n8n/nodes. If you have custom nodes that were linked using npm link into the global node\_modules directory, you need to link them again, into \~/.n8n/nodes instead. 

PR \#6396{:target=\_blank .external link} 

WebSockets 

The N8N\_PUSH\_BACKEND environment variable can be used to configure one of two available methods for pushing updates to the user interface: sse and websocket. Starting with n8n 1.0, websocket is the default method. 

PR \#6196{:target=\_blank .external link} 

Date transformation functions 

n8n provides various transformation functions that operate on dates. These functions may return either a JavaScript Date or a Luxon DateTime object. With the new behavior, the return type always matches the input. If you call a date transformation function on a Date, it returns a Date. Similarly, if you call it on a DateTime object, it returns a DateTime object. 

To identify any workflows and nodes that might be impacted by this change, you can use this utility workflow{:target=\_blank .external link}. 

For more information about date transformation functions, please refer to the official documentation. 

PR \#6435{:target=\_blank .external link} 

Execution data retention 

Starting from n8n 1.0, all successful, failed, and manual workflow executions will be saved by default. These settings can be modified for each workflow under “Workflow Settings,” or globally using the respective environment variables. Additionally, the EXECUTIONS\_DATA\_PRUNE setting will be enabled by default, with EXECUTIONS\_DATA\_PRUNE\_MAX\_COUNT set to 10,000. These default settings are designed to prevent performance degradation when using SQLite. Make sure to configure them according to your individual requirements and system capacity. 

PR \#6577{:target=\_blank .external link} 

Removed N8N\_USE\_DEPRECATED\_REQUEST\_LIB 

The legacy request library has been deprecated for some time now. As of n8n 1.0, the ability to fall back to it in the HTTP Request node by setting the N8N\_USE\_DEPRECATED\_REQUEST\_LIB environment variable has been fully removed. The HTTP Request node will now always use the new HttpRequest interface. 

If you build custom nodes, refer to HTTP request helpers for more information on migrating to the new interface. 

PR \#6413{:target=\_blank .external link}  
Removed WEBHOOK\_TUNNEL\_URL 

As of version 0.227.0, n8n has renamed the WEBHOOK\_TUNNEL\_URL configuration option to WEBHOOK\_URL. In n8n 1.0, WEBHOOK\_TUNNEL\_URL has been removed. Update your setup to reflect the new name. For more information about this configuration option, refer to the docs. 

PR \#1408{:target=\_blank .external link} 

Remove Node 16 support 

n8n now requires Node 18.17.0 or above. 

Updating to n8n 1.0 

1\. Create a full backup of n8n. 

2\. n8n recommends updating to the latest n8n 0.x release before updating to n8n 1.x. This will allow you to pinpoint any potential issues to the correct release. Once you have verified that n8n 0.x starts up without any issues, proceed to the next step. 

3\. Carefully read the Deprecations and Breaking Changes sections above to assess how they may affect your setup. 

4\. Update to n8n 1.0: 

o During beta (before July 24th 2023): If using Docker, pull the next Docker image. 

o After July 24th 2023: If using Docker, pull the latest Docker image. 5\. If you encounter any issues, redeploy the previous n8n version and restore the backup. 

Reporting issues 

If you encounter any issues during the process of updating to n8n 1.0, please seek help in the community forum{:target=\_blank .external link}. 

Thank you 

We would like to take a moment to express our gratitude to all of our users for their continued support and feedback. Your contributions are invaluable in helping us make n8n the best possible automation tool. We’re excited to continue working with you as we move forward with the release of version 1.0 and beyond. Thank you for being a part of our journey\! 

docs-n8n.md 

Choose your n8n 

This section contains information on n8n’s range of platforms, pricing plans, and licenses. Platforms 

There are different ways to set up n8n depending on how you intend to use it:  
∙ n8n Cloud: hosted solution, no need to install anything. 

∙ Self-host: recommended method for production or customized use cases. o npm 

o Docker 

o Server setup guides for popular platforms 

∙ Embed: n8n Embed allows you to white label n8n and build it into your own product. Contact n8n on the Embed website{:target=\_blank .external-link} for pricing and support. 

–8\<– “\_snippets/self-hosting/warning.md” 

Licenses 

n8n’s Sustainable Use License{:target=\_blank .external-link} and n8n Enterprise License{:target=\_blank .external-link} are based on the fair-code model. 

For a detailed explanation of the license, refer to Sustainable Use License. Free versions 

n8n offers the following free options: 

∙ A free trial of Cloud 

∙ A free self-hosted community edition for self-hosted users 

Paid versions 

n8n has two paid versions: 

∙ n8n Cloud: choose from a range of paid plans to suit your usage and feature needs. ∙ Self-hosted: there are both free and paid versions of self-hosted. 

For details of the Cloud plans and contact details for Enterprise Self-hosted, refer to Pricing{:target=\_blank .external-link} on the n8n website. 

docs-secrets.md 

External secrets 

/// info | Feature availability \* External secrets are available on Enterprise Self-hosted and Enterprise Cloud plans. \* n8n supports AWS Secrets Manager, Azure Key Vault, GCP Secrets Manager, Infisical and HashiCorp Vault. \* n8n doesn’t support HashiCorp Vault Secrets{:target=\_blank .external-link}. /// 

You can use an external secrets store to manage credentials for n8n.  
n8n stores all credentials encrypted in its database, and restricts access to them by default. With the external secrets feature, you can store sensitive credential information in an external vault, and have n8n load it in when required. This provides an extra layer of security and allows you to manage credentials used across multiple n8n environments in one central place. 

Connect n8n to your secrets store 

/// note | Secret names Your secret names can’t contain spaces, hyphens, or other special characters. n8n supports secret names containing alphanumeric characters (a-z, A-Z, and 0-9), and underscores. n8n currently only supports plaintext values for secrets, not JSON objects or key-value pairs. /// 

1\. In n8n, go to **Settings** \> **External Secrets**. 

2\. Select **Set Up** for your store provider. 

3\. Enter the credentials for your provider: 

o Azure Key Vault: Provide your **vault name**, **tenant ID**, **client ID**, and **client secret**. Refer to the Azure documentation to register a Microsoft Entra ID app and create a service principal{:target=\_blank .external-link}. n8n supports only single-line values for secrets. 

o AWS Secrets Manager: provide your **access key ID**, **secret access key**, and **region**. The IAM user must have the secretsmanager:ListSecrets, 

secretsmanager:BatchGetSecretValue, and   
secretsmanager:GetSecretValue permissions. 

To give n8n access to all secrets in your AWS Secrets Manager, you can attach the following policy to the IAM user: json { "Version": "2012-10- 17", "Statement": \[ { "Sid": 

"AccessAllSecrets", "Effect": "Allow",  

"Action": \[ "secretsmanager:ListSecrets",  "secretsmanager:BatchGetSecretValue",  

"secretsmanager:GetResourcePolicy",  

"secretsmanager:GetSecretValue",  

"secretsmanager:DescribeSecret", 

"secretsmanager:ListSecretVersionIds", \],  

"Resource": "\*" } \] } 

You can also be more restrictive and give n8n access to select specific AWS Secret Manager secrets. You still need to allow the 

secretsmanager:ListSecrets and secretsmanager:BatchGetSecretValue permissions to access all resources. These permissions allow n8n to retrieve ARN-scoped secrets, but don’t provide access to the secret values. 

Next, you need set the scope for the secretsmanager:GetSecretValue permission to the specific Amazon Resource Names (ARNs) for the secrets you wish to share with n8n. Ensure you use the correct region and account ID in each resource ARNs. You can find the ARN details in the AWS dashboard for your secrets.  
For example, the following IAM policy only allows access to secrets with a name starting with n8n in your specified AWS account and region: 

{ 

 "Version": "2012-10-17", 

 "Statement": \[ 

 { 

 "Sid": "ListingSecrets", 

 "Effect": "Allow", 

 "Action": \[ 

 "secretsmanager:ListSecrets", 

 "secretsmanager:BatchGetSecretValue"  \], 

 "Resource": "\*" 

 }, 

 { 

 "Sid": "RetrievingSecrets", 

 "Effect": "Allow", 

 "Action": \[ 

 "secretsmanager:GetSecretValue", 

 "secretsmanager:DescribeSecret" 

 \], 

 "Resource": \[ 

 "arn:aws:secretsmanager:us-west 

2:123456789000:secret:n8n\*" 

 \] 

 } 

 \] 

} 

For more IAM permission policy examples, consult the AWS   
documentation{:target=\_blank .external-link}. 

o HashiCorp Vault: provide the **Vault URL** for your vault instance, and select your **Authentication Method**. Enter your authentication details. Optionally provide a namespace. 

▪ Refer to the HashiCorp documentation for your authentication method: Token auth method{:target=\_blank .external-link} 

AppRole auth method{:target=\_blank .external-link}   
Userpass auth method{:target=\_blank .external-link} 

▪ If you use vault namespaces, you can enter the namespace n8n should connect to. Refer to Vault Enterprise namespaces{:target=\_blank .external-link} for more information on HashiCorp Vault namespaces. 

o Infisical: provide a **Service Token**. Refer to Infisical’s Service token{:target=\_blank .external-link} documentation for information on getting your token. If you self-host Infisical, enter the **Site URL**.  
/// note | Infisical environment Make sure you select the correct Infisical   
environment when creating your token. n8n will load secrets from this   
environment, and won’t have access to secrets in other Infisical environments. n8n only support service tokens that have access to a single environment. /// 

/// note | Infisical folders n8n doesn’t support Infisical folders{:target=\_blank .external-link}. /// 

o Google Cloud Platform: provide a **Service Account Key** (JSON) for a service account that has at least these roles: Secret Manager Secret Accessor and Secret Manager Secret Viewer. Refer to Google’s service account 

documentation{:target=\_blank .external-link} for more information. 

4\. **Save** your configuration. 

5\. Enable the provider using the **Disabled / Enabled** toggle. 

Use secrets in n8n credentials 

To use a secret from your store in an n8n credential: 

1\. Create a new credential, or open an existing one. 

2\. On the field where you want to use a secret: 

1\. Hover over the field. 

2\. Select **Expression**. 

3\. In the field where you want to use a secret, enter an expression referencing the secret name: js {{ $secrets.\<vault-name\>.\<secret-name\> }} \<vault-name\> is either vault (for HashiCorp) or infisical or awsSecretsManager. Replace \<secret-name\> with the name as it appears in your vault. 

Using external secrets with n8n environments 

n8n’s Source control and environments feature allows you to create different n8n environments, backed by Git. The feature doesn’t support using different credentials in different instances. You can use an external secrets vault to provide different credentials for different environments by connecting each n8n instance to a different vault or project environment. 

For example, you have two n8n instances, one for development and one for production. You use Infisical for your vault. In Infisical, create a project with two environments, development and production. Generate a token for each Infisical environment. Use the token for the development environment to connect your development n8n instance, and the token for your production environment to connect your production n8n instance. 

Using external secrets in projects 

To use external secrets in an RBAC project, you must have an instance owner or instance admin as a member of the project.  
Troubleshooting 

Infisical version changes 

Infisical version upgrades can introduce problems connecting to n8n. If your Infisical connection stops working, check if there was a recent version change. If so, report the issue to help@n8n.io. 

Only set external secrets on credentials owned by an instance owner or admin 

Due to the permissions that instance owners and admins have, it’s possible for owners and admins to update credentials owned by another user with a secrets expression. This will appear to work in preview for an instance owner or admin, but the secret won’t resolve when the workflow runs in production. 

Only use external secrets for credentials that are owned by an instance admin or owner. This ensures they resolve correctly in production. 

docs.md 

*AI agent* 

AI agents are artificial intelligence systems capable of responding to requests, making decisions, and performing real-world tasks for users. They use large language models (LLMs) to interpret user input and make decisions about how to best process requests using the information and resources they have available. 

*AI chain* 

AI chains allow you to interact with large language models (LLMs) and other resources in sequences of calls to components. AI chains in n8n don’t use persistent memory, so you can’t use them to reference previous context (use AI agents for this). 

*AI embedding* 

Embeddings are numerical representations of data using vectors. They’re used by AI to interpret complex data and relationships by mapping values across many dimensions. Vector databases, or vector stores, are databases designed to store and access embeddings. 

*AI memory* 

In an AI context, memory allows AI tools to persist message context across interactions. This allows you to have a continuing conversations with AI agents, for example, without submitting ongoing context with each message. In n8n, AI agent nodes can use memory, but AI chains can’t. 

*AI tool* 

In an AI context, a tool is an add-on resource that the AI can refer to for specific information or functionality when responding to a request. The AI model can use a tool to interact with external systems or complete specific, focused tasks.  
*AI vector store* 

Vector stores, or vector databases, are databases designed to store numerical representations of information called embeddings. 

*API* 

APIs, or application programming interfaces, offer programmatic access to a service’s data and functionality. APIs make it easier for software to interact with external systems. They’re often offered as an alternative to traditional user-focused interfaces accessed through web browsers or UI. 

*canvas (n8n)* 

The canvas is the main interface for building workflows in n8n’s editor UI. You use the canvas to add and connect nodes to compose workflows. 

*cluster node (n8n)* 

In n8n, cluster nodes are groups of nodes that work together to provide functionality in a workflow. They consist of a root node and one or more sub nodes that extend the node’s functionality. 

*credential (n8n)* 

In n8n, credentials store authentication information to connect with specific apps and services. After creating credentials with your authentication information (username and password, API key, OAuth secrets, etc.), you can use the associated app node to interact with the service. 

*data pinning (n8n)* 

Data pinning allows you to temporarily freeze the output data of a node during workflow development. This allows you to develop workflows with predictable data without making repeated requests to external services. Production workflows ignore pinned data and request new data on each execution. 

*editor (n8n)* 

The n8n editor UI allows you to create and manage workflows. The main area is the canvas, where you can compose workflows by adding, configuring, and connecting nodes. The side and top panels allow you to access other areas of the UI like credentials, templates, variables, executions, and more. 

*entitlement (n8n)* 

In n8n, entitlements grant n8n instances access to plan-restricted features for a specific period of time. 

Floating entitlements are a pool of entitlements that you can distribute among various n8n instances. You can re-assign a floating entitlement to transfer its access to a different n8n instance.  
*evaluation (n8n)* 

In n8n, evaluation allows you to tag and organize execution history and compare it against new executions. You can use this to understand how your workflow performs over time as you make changes. In particular, this is useful while developing AI-centered workflows. 

*expression (n8n)* 

In n8n, expressions allow you to populate node parameters dynamically by executing JavaScript code. Instead of providing a static value, you can use the n8n expression syntax to define the value using data from previous nodes, other workflows, or your n8n environment. 

*LangChain* 

LangChain is an AI-development framework used to work with large language models (LLMs). LangChain provides a standardized system for working with a wide variety of models and other resources and linking different components together to build complex applications. 

*Large language model (LLM)* 

Large language models, or LLMs, are AI machine learning models designed to excel in natural language processing (NLP) tasks. They’re built by training on large amounts of data to develop probabilistic models of language and other data. 

*node (n8n)* 

In n8n, nodes are individual components that you compose to create workflows. Nodes define when the workflow should run, allow you to fetch, send, and process data, can define flow control logic, and connect with external services. 

*project (n8n)* 

n8n projects allow you to separate workflows, variables, and credentials into separate groups for easier management. Projects make it easier for teams to collaborate by sharing and compartmentalizing related resources. 

*root node (n8n)* 

Each n8n cluster node contains a single root nodes that defines the main functionality of the cluster. One or more sub nodes attach to the root node to extend its functionality. 

*sub node (n8n)* 

n8n cluster nodes consist of one or more sub nodes connected to a root node. Sub nodes extend the functionality of the root node, providing access to specific services or resources or offering specific types of dedicated processing, like calculator functionality, for example. 

*template (n8n)* 

n8n templates are pre-built workflows designed by n8n and community members that you can import into your n8n instance. When using templates, you may need to fill in credentials and adjust the configuration to suit your needs.  
*trigger node (n8n)* 

A trigger node is a special node responsible for executing the workflow in response to certain conditions. All production workflows need at least one trigger to determine when the workflow should run. 

*workflow (n8n)* 

An n8n workflow is a collection of nodes that automate a process. Workflows begin execution when a trigger condition occurs and execute sequentially to achieve complex tasks. 

docs.md 

Welcome to n8n Docs 

This is the documentation for n8n{:target=\_blank .external-link}, a fair-code{:target=\_blank .external-link} licensed workflow automation tool that combines AI capabilities with business process automation. 

It covers everything from setup to usage and development. It’s a work in progress and all contributions are welcome. 

Where to start 

∙ **Quickstarts** 

Jump in with n8n’s quickstart guides. 

:octicons-arrow-right-24: Try it out 

∙ **Choose the right n8n for you** 

Cloud, npm, self-host . . . 

:octicons-arrow-right-24: Options 

∙ **Explore integrations** 

Browse n8n’s integrations library. 

:octicons-arrow-right-24: Find your apps 

∙ **Build AI functionality** 

n8n supports building AI functionality and tools. 

:octicons-arrow-right-24: Advanced AI  
About n8n 

n8n (pronounced n-eight-n) helps you to connect any app with an API with any other, and manipulate its data with little or no code. 

∙ Customizable: highly flexible workflows and the option to build custom nodes. ∙ Convenient: use the npm or Docker to try out n8n, or the Cloud hosting option if you want us to handle the infrastructure. 

∙ Privacy-focused: self-host n8n for privacy and security. 

docs.md 

Insights 

Insights gives instance owners and admins visibility into how workflows perform over time. This feature consists of three parts: 

∙ **Insights summary banner**: Shows key metrics about your instance from the last 7 days at the top of the overview space. 

∙ **Insights dashboard**: A more detailed visual breakdown with per-workflow metrics and historical comparisons. 

∙ **Time saved (Workflow ROI)**: For each workflow, you can set the number of minutes of work that each production execution saves you. 

/// info | Feature availability The insights summary banner displays activity from the last 7 days for all plans. The insights dashboard is only available on Pro (with limited date ranges) and Enterprise plans. /// 

Insights summary banner 

n8n collects several metrics for both the insights summary banner and dashboard. They include: 

∙ Total production executions (not including sub-workflow executions or manual executions) 

∙ Total failed production executions 

∙ Production execution failure rate 

∙ Time saved (when set on at least one or more active workflows) 

∙ Run time average (including wait time from any wait nodes) 

Insights dashboard 

Those on the Pro and Enterprise plans can access the **Insights** section from the side navigation. Each metric from the summary banner is also clickable, taking you to the corresponding chart.  
The insights dashboard also has a table showing individual insights from each workflow including total production executions, failed production executions, failure rate, time saved, and run time average. 

Insights time periods 

By default, the insights summary banner and dashboard show a rolling 7 day window with a comparison to the previous period to identify increases or decreases for each metric. On the dashboard, paid plans also display data for other date ranges: 

∙ Pro: 7 and 14 days 

∙ Enterprise: 24 hours, 7 days, 14 days, 30 days, 90 days, 6 months, 1 year Setting the time saved by a workflow 

For each workflow, you can set the number of minutes of work a workflow saves you each time it runs. You can configure this by navigating to the workflow, selecting the three dots menu in the top right and selecting settings. There you can update the **Estimated time saved** value and save. 

This setting helps you calculate how much time automating a process saves over time vs the manual effort to complete the same task or process. Once set, n8n calculates the amount of time the workflow saves you based on the number of production executions and displays it on the summary banner and dashboard. 

Disable or configure insights metrics collection 

If you self-host n8n, you can disable or configure insights and metrics collection using environment variables. 

Insights FAQs 

Which executions do n8n use to calculate the values in the insights banner and dashboard? 

n8n insights only collects data from production executions (for example, those from active workflows triggered on a schedule or a webhook) from the main (parent) workflow. This means that it doesn’t count manual (test) executions or executions from sub-workflows or error workflows. 

Does n8n use historic execution data when upgrading to a version with insights? 

n8n only starts collecting data for insights once you update to the first supported version (1.89.0). This means it only reports on executions from that point forward and you won’t see execution data in insights from prior periods.  
docs-shortcuts.md 

Keyboard shortcuts and controls 

n8n provides keyboard shortcuts for some actions. 

Workflow controls 

∙ **Ctrl** \+ **Alt** \+ **n**: create new workflow 

∙ **Ctrl** \+ **o**: open workflow 

∙ **Ctrl** \+ **s**: save the current workflow 

∙ **Ctrl** \+ **z**: undo 

∙ **Ctrl** \+ **shift** \+ **z**: redo 

∙ **Ctrl** \+ **Enter**: execute workflow 

Canvas 

Move the canvas 

∙ **Ctrl** \+ **Left Mouse Button** \+ drag: move node view 

∙ **Ctrl** \+ **Middle mouse button** \+ drag: move node view 

∙ **Space** \+ drag: move node view 

∙ **Middle mouse button** \+ drag: move node view 

∙ Two fingers on a touch screen: move node view 

Canvas zoom 

∙ **\+** or **\=**: zoom in 

∙ **\-** or \*\*\_\*\*: zoom out 

∙ **0**: reset zoom level 

∙ **1**: zoom to fit workflow 

∙ **Ctrl** \+ **Mouse wheel**: zoom in/out 

Nodes on the canvas 

∙ **Double click** on a node: open the node details 

∙ **Ctrl/Cmd** \+ **Double click** on a sub-workflow node: open the sub-workflow in a new tab ∙ **Ctrl** \+ **a**: select all nodes 

∙ **Ctrl** \+ **v**: paste nodes 

∙ **Shift** \+ **s**: add sticky note 

With one or more nodes selected in canvas 

∙ **ArrowDown**: select sibling node below the current one 

∙ **ArrowLeft**: select node left of the current one 

∙ **ArrowRight**: select node right of the current one  
∙ **ArrowUp**: select sibling node above the current one 

∙ **Ctrl** \+ **c**: copy 

∙ **Ctrl** \+ **x**: cut 

∙ **D**: deactivate 

∙ **Delete**: delete 

∙ **Enter**: open 

∙ **F2**: rename 

∙ **P**: pin data in node. Refer to Data pinning for more information. 

∙ **Shift** \+ **ArrowLeft**: select all nodes left of the current one 

∙ **Shift** \+ **ArrowRight**: select all nodes right of the current one 

∙ **Ctrl/Cmd** \+ **Shift** \+ **o** on a sub-workflow node: open the sub-workflow in a new tab Node panel   
∙ **Tab**: open the Node Panel 

∙ **Enter**: insert selected node into workflow 

∙ **Escape**: close Node panel 

Node panel categories 

∙ **Enter**: insert node into workflow, collapse/expand category, open subcategory ∙ **ArrowRight**: expand category, open subcategory 

∙ **ArrowLeft**: collapse category, close subcategory view 

Within nodes 

∙ **\=**: in an empty parameter input, this switches to expressions mode. 

docs-path.md 

This guide outlines a series of tutorials and resources designed to get you started with n8n. 

It’s not necessary to complete all items listed to start using n8n. Use this as a reference to navigate to the most relevant parts of the documentation and other resources according to your needs. 

Join the community 

n8n has an active community where you can get and offer help. Connect, share, and learn with other n8n users: 

∙ Ask questions{:target=\_blank .external-link} and make feature requests{:target=\_blank .external-link} in the Community Forum. 

∙ Report bugs{:target=\_blank .external-link} and contribute{:target=\_blank .external-link} on GitHub.  
Set up your n8n 

If you don’t have an account yet, sign up to a free trial on n8n Cloud{:target=\_blank .external link} or install n8n’s community edition with Docker (recommended) or npm. See Choose your n8n for more details. 

Try it out 

Start with the quickstart guides to help you get up and running with building basic workflows. 

∙ A very quick quickstart 

∙ A longer introduction 

∙ Build an AI workflow in n8n 

Structured Courses 

n8n offers two sets of courses. 

Video courses 

Learn key concepts and n8n features, while building examples as you go. 

∙ The Beginner{:target=\_blank .external-link} course covers the basics of n8n. ∙ The Advanced{:target=\_blank .external-link} course covers more complex workflows, more technical nodes, and enterprise features 

Text courses 

Build more complex workflows while learning key concepts along the way. Earn a badge and an avatar in your community profile. 

∙ Level 1: Beginner Course{:target=\_blank .external-link} 

∙ Level 2: Intermediate Course{:target=\_blank .external-link} 

Self-hosting n8n 

Explore various self-hosting options in n8n. If youâ€™re not sure where to start, these are two popular options: 

∙ Hosting n8n on DigitalOcean 

∙ Hosting n8n on Amazon Web Services 

Build a node 

If you can’t find a node for a specific app or a service, you can build a node yourself and share with the community. See what others have built on npm website{:target=\_blank .external-link}. 

∙ Build a declarative-style node 

∙ Learn how to build your own n8n nodes (Youtube Video){:target=\_blank .external-link}  
Stay updated 

∙ Follow new features and bug fixes in the Release Notes 

∙ Follow n8n on socials: Twitter/X{:target=\_blank .external-link}, Discord{:target=\_blank .external-link}, LinkedIn{:target=\_blank .external-link}, YouTube{:target=\_blank .external-link} 

docs-key.md 

License Key 

To enable certain licensed features, you must first activate your license. You can do this either through the UI or by setting environment variables. 

Add a license key using the UI 

In your n8n instance: 

1\. Log in as **Admin** or **Owner**. 

2\. Select **Settings** \> **Usage and plan**. 

3\. Select **Enter activation key**. 

4\. Paste in your license key. 

5\. Select **Activate**. 

Add a license key using an environment variables 

In your n8n configuration, set N8N\_LICENSE\_ACTIVATION\_KEY to your license key. If the instance already has an activated license, this variable will have no effect. 

Refer to Environment variables to learn more about configuring n8n. 

Allowlist the license server IP addresses 

n8n uses Cloudflare to host the license server. As the specific IP addresses can change, you need to allowlist the full range of Cloudflare IP addresses to ensure n8n can always reach the license server. 

docs-streaming.md 

Log streaming 

/// info | Feature availability Log streaming is available on Enterprise Self-hosted and Cloud plans. ///  
Log streaming allows you to send events from n8n to your own logging tools. This allows you to manage your n8n monitoring in your own alerting and logging processes. 

Set up log streaming 

To use log streaming, you have to add a streaming destination. 

1\. Navigate to **Settings** \> **Log Streaming**. 

2\. Select **Add new destination**. 

3\. Choose your destination type. n8n opens the **New Event Destination** modal. 4\. In the **New Event Destination** modal, enter the configuration information for your event destination. These depend on the type of destination you’re using. 

5\. Select **Events** to choose which events to stream. 

6\. Select **Save**. 

/// note | Self-hosted users If you self-host n8n, you can configure additional log streaming behavior using Environment variables. /// \#\# Events 

The following events are available. You can choose which events to stream in **Settings** \> **Log Streaming** \> **Events**. 

∙ Workflow 

o Started 

o Success 

o Failed 

∙ Node executions 

o Started 

o Finished 

∙ Audit 

o User signed up 

o User updated 

o User deleted 

o User invited 

o User invitation accepted 

o User re-invited 

o User email failed 

o User reset requested 

o User reset 

o User credentials created 

o User credentials shared 

o User credentials updated 

o User credentials deleted 

o User API created 

o User API deleted  
o Package installed 

o Package updated 

o Package deleted 

o Workflow created 

o Workflow deleted 

o Workflow updated 

∙ AI node logs 

o Memory get messages 

o Memory added message 

o Output parser get instructions 

o Output parser parsed 

o Retriever get relevant documents 

o Embeddings embedded document 

o Embeddings embedded query 

o Document processed 

o Text splitter split 

o Tool called 

o Vector store searched 

o LLM generated 

o Vector store populated 

Destinations 

n8n supports three destination types: 

∙ A syslog server 

∙ A generic webhook 

∙ A Sentry client 

docs-notes.md 

Release notes 

New features and bug fixes for n8n. 

You can also view the Releases{:target=\_blank .external-link} in the GitHub repository. –8\<– “\_snippets/self-hosting/installation/latest-next-version.md” 

–8\<– “\_snippets/update-n8n.md”  
Semantic versioning in n8n 

n8n uses semantic versioning{:target=\_blank .external-link}. All version numbers are in the format MAJOR.MINOR.PATCH. Version numbers increment as follows: 

∙ MAJOR version when making incompatible changes which can require user action. ∙ MINOR version when adding functionality in a backward-compatible manner. ∙ PATCH version when making backward-compatible bug fixes. 

/// note | Older versions You can find the release notes for older versions of n8n here /// n8n@1.97.0 

View the commits{:target=\_blank .external-link} for this version. **Release date:** 2025-06-02 This release contains performance improvements and bug fixes. 

Contributors 

maatthc{:target=\_blank .external-link} 

For full release details, refer to Releases{:target=\_blank .external-link} on GitHub. n8n@1.96.0 

View the commits{:target=\_blank .external-link} for this version. **Release date:** 2025-06-02 /// warning | Build failure This release failed to build. Please use 1.97.0 instead. /// 

This release contains API updates, core changes, editor improvements, node updates, and bug fixes. 

Contributors 

matthabermehl{:target=\_blank .external-link}   
Stamsy{:target=\_blank .external-link} 

For full release details, refer to Releases{:target=\_blank .external-link} on GitHub. n8n@1.95.2 

View the commits{:target=\_blank .external-link} for this version. **Release date:** 2025-05-29 This release contains bug fixes. 

For full release details, refer to Releases{:target=\_blank .external-link} on GitHub. n8n@1.95.1 

View the commits{:target=\_blank .external-link} for this version. **Release date:** 2025-05-27  
/// note | Next version This is the next version. n8n recommends using the latest version. The next version may be unstable. To report issues, use the forum{:target=\_blank .external-link}. /// 

This release contains bug fixes. 

For full release details, refer to Releases{:target=\_blank .external-link} on GitHub. n8n@1.94.1 

View the commits{:target=\_blank .external-link} for this version. **Release date:** 2025-05-27 

/// note | Latest version This is the latest version. n8n recommends using the latest version. The next version may be unstable. To report issues, use the forum{:target=\_blank .external link}. /// 

This release contains bug fixes. 

For full release details, refer to Releases{:target=\_blank .external-link} on GitHub. n8n@1.95.0 

View the commits{:target=\_blank .external-link} for this version. **Release date:** 2025-05-26 This release contains core updates, editor improvements, node updates, and bug fixes. Contributors 

Phiph{:target=\_blank .external-link}   
cesars-gh{:target=\_blank .external-link} 

For full release details, refer to Releases{:target=\_blank .external-link} on GitHub. n8n@1.94.0 

View the commits{:target=\_blank .external-link} for this version. **Release date:** 2025-05-19 

This release contains editor improvements, an API update, node updates, new nodes, and bug fixes. 

Verified community nodes on Cloud 

Weâ€™ve expanded the n8n ecosystem and unlocked a new level of flexibility for all users including those on n8n Cloud\! Now you can access a select set of community nodes and partner integrations without leaving the canvas. This means you install and automate with a wider range of integrations without leaving your workspace. The power of the community is now built-in. 

This update focuses on three major improvements: 

∙ **Cloud availability**: Community nodes are no longer just for self-hosted users. A select set of nodes is now available on n8n Cloud. 

∙ **Built-in discovery**: You can find and explore these nodes right from the Nodes panel without leaving the editor or searching on npm.  
∙ **Trust and verification**: Nodes that appear in the editor have been manually vetted for quality and security. These verified nodes are marked with a checkmark. 

Weâ€™re starting with a selection of around 25 nodes, including some of the most-used community-built packages and partner-supported integrations. For this phase, we focused on nodes that donâ€™t include external package dependencies \- helping streamline the review process and ensure a smooth rollout.  

This is just the start. We plan to expand the library gradually, bringing even more verified nodes into the editor along with the powerful and creative use cases they unlock. In time, our criteria will evolve, opening the door to a wider range of contributions while keeping quality and security in focus.  

Learn more about this update and find out which nodes are already installable from the editor in our blog post. 

ðŸ’» **Use a verified node** 

Make sure you’re on **n8n version 1.94.0** or later and the instance Owner has enabled verified community nodes. On Cloud, this can be done from the Admin Panel. For self-hosted instances, please refer to documentation. In both cases, verified nodes are enabled by default. 

∙ Open the **Nodes panel** from the editor 

∙ Search for the Node. Verified nodes are indicated by a shield ðŸ›¡ï¸ ∙ Select the node and click **Install** 


Once an Owner installs a node, everyone on the instance can start using itâ€”just drag, drop, and connect like any other node in your workflow. 

ðŸ› ï¸ **Build a node and get it verified** 

Want your node to be verified and discoverable from the editor? Hereâ€™s how to get involved: 

1\. Review the community node verification guidelines. 

2\. If youâ€™re building something new, follow the recommendations for creating nodes. 3\. Check your design against the UX guidelines. 

4\. Submit your node to npm. 

5\. Request verification by filling out this form. 

**Already built a node? Raise your hand\!**  
If youâ€™ve already published a community node and want it considered for verification, make sure it meets the requirements noted above, then let us know by submitting the interest form. Weâ€™re actively curating the next batch and would love to include your work. 

Extended logs view 

When workflows get complex, debugging can get… clicky. Thatâ€™s where an extended **Logs View** comes in. Now you can get a clearer path to trace executions, troubleshoot issues, and understand the behavior of a complete workflow â€” without bouncing between node detail views. 

This update brings a unified, always-accessible panel to the bottom of the canvas, showing you each step of the execution as it happens. Whether you’re working with loops, sub-workflows, or AI agents, youâ€™ll see a structured view of everything that ran, in the order it ranâ€”with input, output, and status info right where you need it. 

You can jump into node details when you want to dig deeper, or follow a single item through every step it touched. Real-time highlighting shows you which nodes are currently running or have failed, and youâ€™ll see total execution time for any workflowâ€”plus token usage for AI workflows to help monitor performance. And if you’re debugging across multiple screens? Just pop the logs out and drag them wherever youâ€™d like. 

âš™ï¸**What it does** 

∙ Adds a **Logs view** to the bottom of the canvas that can be opened or collapsed. (Chat also appears here if your workflow uses it). 

∙ Displays a **hierarchical list of nodes** in the order they were executedâ€”including expanded views of sub-workflows. 

∙ Allows you to **click a node in hierarchy** to preview inputs and outputs directly, or jump into the full Node Details view with a link. 

∙ Provides ability to **toggle** input and output data on and off. 

∙ Highlights each node **live as it runs**, showing when it starts, completes, or fails. ∙ Includes **execution history** view to explore past execution data in a similar way. ∙ Shows **roll-up stats** like total execution time and total AI tokens used (for AI-enabled workflows). 

∙ Includes a **â€œpop outâ€** button to open the logs as a floating windowâ€”perfect for dragging to another screen while debugging. 

ðŸ› ï¸**How to** 

To access the expanded logs view, click on the Logs bar at the bottom of the canvas. The view is also opens up when you open the chat window on the bottom of the page. 

Contributors 

Stamsy{:target=\_blank .external-link}   
feelgood-interface{:target=\_blank .external-link} 

For full release details, refer to Releases{:target=\_blank .external-link} on GitHub.  
n8n@1.93.0 

View the commits{:target=\_blank .external-link} for this version. **Release date:** 2025-05-12 

This release contains core updates, editor improvements, new nodes, node updates, and bug fixes. 

Faster ways to open sub-workflows 

Weâ€™ve added several new ways to navigate your multi-workflow automations faster. From any workflow with a sub-workflow node: 

ðŸ–±ï¸ Right-click on a sub-workflow node and select Open sub-workflow from the context menu 

âŒ¨ï¸ Keyboard shortcuts 

∙ **Windows:** CTRL \+ SHIFT \+ O or CTRL \+ Double Click 

∙ **Mac:** CMD \+ SHIFT \+ O or CMD \+ Double Click 

These options will bring your sub-workflow up in a new tab. 

Archive workflows 

If youâ€™ve ever accidentally removed a workflow, youâ€™ll appreciate the new archiving feature. Instead of permanently deleting workflows with the Remove action, workflows are now archived by default. This allows you to recover them if needed. 

**How to:** 

∙ **Archive a workflow** \- Select **Archive** from the Editor UI menu. It has replaced the **Remove** action. 

∙ **Find archived workflows** \- Archived workflows are hidden by default. To find your archived workflows, select the option for **Show archived workflows** in the workflow filter menu. 

∙ **Permanently delete a workflow** \- Once a workflow is archived, you can **Delete** it from the options menu. 

∙ **Recover a workflow** \- Select **Unarchive** from the options menu. 

**Keep in mind:** 

∙ Workflows archival requires the same permissions as required previously for removal. ∙ You cannot select archived workflows as sub-workflows to execute 

∙ Active workflows are deactivated when they are archived 

∙ Archived workflows can not be edited  
Contributors 

LeaDevelop{:target=\_blank .external-link}   
ayhandoslu{:target=\_blank .external-link}   
valentina98{:target=\_blank .external-link} 

For full release details, refer to Releases{:target=\_blank .external-link} on GitHub. n8n@1.92.2 

View the commits{:target=\_blank .external-link} for this version. **Release date:** 2025-05-08 This release contains a bug fix. 

For full release details, refer to Releases{:target=\_blank .external-link} on GitHub. n8n@1.91.3 

View the commits{:target=\_blank .external-link} for this version. **Release date:** 2025-05-08 This release contains a bug fix. 

For full release details, refer to Releases{:target=\_blank .external-link} on GitHub. n8n@1.92.1 

View the commits{:target=\_blank .external-link} for this version. **Release date:** 2025-05-06 This release contains a bug fix. 

For full release details, refer to Releases{:target=\_blank .external-link} on GitHub. n8n@1.92.0 

View the commits{:target=\_blank .external-link} for this version. **Release date:** 2025-05-05 This release contains core updates, editor improvements, node updates, and bug fixes. Partial Execution for AI Tools 

Weâ€™ve made it easier to build and iterate on AI agents in n8n. You can now run and test specific tools without having to execute the entire agent workflow. 

Partial execution is especially useful when refining or troubleshooting parts of your agent logic. It allows you to test changes incrementally, without triggering full agent runs, reducing unnecessary AI calls, token usage, and downstream activity. This makes iteration faster, more cost-efficient, and more precise when working with complex or multi-step AI workflows. 

Partial execution for AI tools is available now for all tools \- making it even easier to build, test, and fine-tune AI agents in n8n. 

   
**How to:** 

To use this feature you can either: 

∙ Click the **Play** button on the tool you want to execute directly from the canvas view. ∙ Open the toolâ€™s **Node Details View** and select **“Test step”** to run it from there. 

If you have previously run the workflow, the input and output will be prefilled with data from the last execution. A pop-up form will open where you can manually fill in the parameters before executing your test. 

Extended logs view 

When workflows get complex, debugging can get… clicky. Thatâ€™s where an extended **Logs View** comes in. Now you can get a clearer path to trace executions, troubleshoot issues, and understand the behavior of a complete workflow â€” without bouncing between node detail views. 

This update brings a unified, always-accessible panel to the bottom of the canvas, showing you each step of the execution as it happens. Whether you’re working with loops, sub-workflows, or AI agents, youâ€™ll see a structured view of everything that ran, in the order it ranâ€”with input, output, and status info right where you need it. 

You can jump into node details when you want to dig deeper, or follow a single item through every step it touched. Real-time highlighting shows you which nodes are currently running or have failed, and youâ€™ll see total execution time for any workflowâ€”plus token usage for AI workflows to help monitor performance. And if you’re debugging across multiple screens? Just pop the logs out and drag them wherever youâ€™d like. 

âš™ï¸**What it does** 

∙ Adds a **Logs view** to the bottom of the canvas that can be opened or collapsed. (Chat also appears here if your workflow uses it). 

∙ Displays a **hierarchical list of nodes** in the order they were executedâ€”including expanded views of sub-workflows. 

∙ Allows you to **click a node in hierarchy** to preview inputs and outputs directly, or jump into the full Node Details view with a link. 

∙ Provides ability to **toggle** input and output data on and off. 

∙ Highlights each node **live as it runs**, showing when it starts, completes, or fails. ∙ Includes **execution history** view to explore past execution data in a similar way. ∙ Shows **roll-up stats** like total execution time and total AI tokens used (for AI-enabled workflows). 

∙ Includes a **â€œpop outâ€** button to open the logs as a floating windowâ€”perfect for dragging to another screen while debugging. 

ðŸ› ï¸**How to**  
To access the expanded logs view, click on the Logs bar at the bottom of the canvas. The view is also opens up when you open the chat window on the bottom of the page. 

Insights enhancements for Enterprise 

Two weeks after the launch of Insights, weâ€™re releasing some enhancements designed for enterprise users. 

∙ **Expanded time ranges**. You can now filter insights over a variety of time periods, from the last 24 hours up to 1 year. Pro users are limited to 7 day and 14 day views. 

∙ **Hourly granularity**. Drill down into the last 24 hours of production executions with hourly granularity, making it easier to analyze workflows and quickly identify issues. 

These updates provide deeper visibility into workflow history, helping you uncover trends over longer periods and detect problems sooner with more precise reporting. 

Filter insights 

*Filter insights* 

Filter insights 

Contributors 

Stamsy{:target=\_blank .external-link} 

For full release details, refer to Releases{:target=\_blank .external-link} on GitHub. n8n@1.91.2 

View the commits{:target=\_blank .external-link} for this version. **Release date:** 2025-05-05 This release contains a bug fix. 

For full release details, refer to Releases{:target=\_blank .external-link} on GitHub. n8n@1.90.3 

View the commits{:target=\_blank .external-link} for this version. **Release date:** 2025-05-05 This release contains a bug fix. 

For full release details, refer to Releases{:target=\_blank .external-link} on GitHub. n8n@1.91.1 

View the commits{:target=\_blank .external-link} for this version. **Release date:** 2025-05-01

[image1]: <data:image/png;base64,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>