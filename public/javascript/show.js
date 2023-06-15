function gpdf(){
    let pdf=new jsPDF('p', 'px', [1400,2000 ]);
    let content=document.getElementById("target");
    specialElementHandlers = {
            '#bypassme': function (element, renderer) {
                return true
            }
    };
    margins = {
            top: 100,
            bottom: 60,
            left: 40,
            width: 522
    };
    pdf.fromHTML(
            content, // HTML string or DOM elem ref.
            margins.left, // x coord
            margins.top, { // y coord
                'width': margins.width, // max width of content on PDF
                'elementHandlers': specialElementHandlers
    },
    function (dispose) {
            pdf.save('Timetable.pdf');
    }, margins);
}
