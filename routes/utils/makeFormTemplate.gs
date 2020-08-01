function createTemplateForm() {
  // Create a template form for a SEERIH event
  const form = FormApp.create('New Form 2');

  form
  .setProgressBar(true)
  .setDescription('Take five minutes to make The Great Science Share better!');

  form.addTextItem()
  .setTitle("Tell us where you are from! What's your postcode?")
  .setRequired(true);

  form.addPageBreakItem()
  .setTitle('Did you like our campaign?');

  form.addCheckboxItem()
  .setTitle('Which parts did you like most?')
  .setChoiceValues(['Twitter Chat with #PrimaryRocks',
                    'Newsletters/weekly email updates',
                    'Weekly themes',
                    'Question Makers',
                    'Great Science Groove-Along',
                    'Live lessons on 16th June',
                    '#AskAQuestion Twitter Chat on 16th June',
                    'Global Science Show on 19th June',
                    'Social media sharing',
                    'Sharing on our website'])
  .showOtherOption(true)
  .setRequired(true);


  form.addPageBreakItem()
  .setTitle('Tell us a bit about the little scientists!');

  form.addMultipleChoiceItem()
  .setTitle('How many took part?')
  .setChoiceValues(['1-10', '10+', '100+', '500+'])
  .setRequired(true);

  form.addMultipleChoiceItem()
  .setTitle('What age group best describes them?')
  .setChoiceValues(['0-5', '5-7', '7-11', '11-14', '14+'])
  .setRequired(true);

  form.addMultipleChoiceItem()
  .setTitle('Did the scientists learn a lot about the world around them?')
  .setChoiceValues(['Yes, a lot!',
                    'Yes, but they say they already knew some of it!',
                    'Just a little bit, they are experienced scientists!',
                    'They already knew everything, they are experts!'])
  .setRequired(true);


  form.addMultipleChoiceItem()
  .setTitle('Did they work independently?')
  .setChoiceValues(['Not at all',
                    'Partially',
                    'Mostly',
                    'Completely'])
  .setRequired(true);

  form.addMultipleChoiceItem()
  .setTitle('How did you support the scientists?')
  .setChoiceValues(['They did everything by themselves',
                    'I encouraged them to explore so they ask their own questions',
                    'I talked with them about data they had collected before in other activities',
                    'I showed them findings other people had found, e.g. on videos or in books',
                    'I used question or discussion prompts e.g. Question Makers or concept cartoons'])
  .showOtherOption(true)
  .setRequired(true);

  form.addPageBreakItem()
  .setTitle('Tell us about yourself!');


  // The future flow of the form:
  // The flow must be defined before to be able to add branch logic later
  const branch = form.addMultipleChoiceItem();

  const parentQuestions = form.addPageBreakItem();
  const educationLevel = form.addMultipleChoiceItem();

  const teacherQuestions = form.addPageBreakItem();
  const teacherType = form.addMultipleChoiceItem();
  const teachingYears = form.addMultipleChoiceItem();
  const timeForScience = form.addMultipleChoiceItem();
  const hoursOfScience = form.addMultipleChoiceItem();

  // Branch question
  const teacher = branch.createChoice('Teacher', teacherQuestions);
  const parent = branch.createChoice('Parent / Carer', FormApp.PageNavigationType.CONTINUE);

  branch
  .setTitle('Are you a teacher or a parent/carer to the scientists?')
  .setChoices([teacher, parent])
  .setRequired(true);

  // Questions for parents
  parentQuestions
    .setTitle('Are you experienced in science?');

  const choice1 = educationLevel.createChoice('GCSE or Standard Grade', FormApp.PageNavigationType.SUBMIT);
  const choice2 = educationLevel.createChoice('A level or Advanced Higher', FormApp.PageNavigationType.SUBMIT);
  const choice3 = educationLevel.createChoice('First Degree (Bachelors)', FormApp.PageNavigationType.SUBMIT);
  const choice4 = educationLevel.createChoice('Higher Degree (Masters or PhD)', FormApp.PageNavigationType.SUBMIT);
  const choice5 = educationLevel.createChoice('None of the above', FormApp.PageNavigationType.SUBMIT);

  educationLevel
  .setTitle('What is your highest level of education in science?')
  .setChoices([choice1, choice2, choice3, choice4, choice5])
  .setRequired(true);

  // Questions for teachers
  teacherQuestions
      .setTitle('Tell us about your teaching experience!');

  teacherType
  .setTitle('Are you...')
  .setChoiceValues(['Governor',
                    'Head teacher',
                    'Science subject leader',
                    'Teacher',
                    'Teaching assistant',
                    'Home educator',
                    'Informal STEM/Science educator',
                    'None of the above'])
  .showOtherOption(true)
  .setRequired(true);

  teachingYears
  .setTitle('How many years of teaching experience have you had?')
  .setChoiceValues(['up to 2 years',
                    'up to 5 years',
                    'up to 10 years',
                    'up to 20 years',
                    'more than 20 years'])
  .setRequired(true);

  timeForScience
  .setTitle('How much of this time is dedicated to children designing their own science investigations?')
  .setChoiceValues(['Hardly any',
                   'Some',
                   'Most'])
  .setRequired(true);

  hoursOfScience
  .setTitle('How many hours of science do you teach each week?')
  .setChoiceValues(['Less than 1.5 hours',
                    '1.5 - 2 hours',
                    '2 – 2.5 hours',
                    'More than 2.5 hours',
                    'Weekly lessons but not sure of hours',
                    'No hours weekly'])
  .setRequired(true);

  return form.getEditUrl();
}
