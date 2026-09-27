from flask import Flask, render_template, request, redirect

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/shop.html')
def shop():
    return render_template('shop.html')

@app.route('/product.html')
def product():
    return render_template('product.html')

@app.route('/cart.html')
def cart():
    return render_template('cart.html')

@app.route('/checkout.html')
def checkout():
    return render_template('checkout.html')

@app.route('/order-confirmation.html')
def order_confirmation():
    return render_template('order-confirmation.html')

@app.route('/track-order.html')
def track_order():
    return render_template('track-order.html')

@app.route('/help-center.html')
def help_center():
    return render_template('help-center.html')

@app.route('/complaint.html')
def complaint():
    return render_template('complaint.html')

@app.route('/account.html')
def account():
    return render_template('account.html')

# SupportNova frontend routes. These intentionally render the existing Jinja
# interfaces only; complaint persistence and workflow actions remain backend
# integration points for the team.
@app.route('/support/')
def support_home():
    return render_template('support/help-center.html')

@app.route('/support/submit')
def support_submit():
    return render_template('support/submit-complaint.html')

@app.route('/support/dashboard')
@app.route('/support/history')
def support_dashboard():
    return render_template('support/customer-cases.html', history=request.path.endswith('/history'))

@app.route('/support/track')
def support_track():
    return render_template('support/customer-cases.html', tracking=True)

@app.route('/support/complaint/<complaint_id>')
@app.route('/support/submitted/<complaint_id>')
def support_complaint(complaint_id):
    return render_template('support/customer-detail.html', complaint_id=complaint_id)

@app.route('/agent/dashboard')
@app.route('/agent/complaints')
@app.route('/agent/escalations')
@app.route('/agent/awaiting')
@app.route('/agent/search')
@app.route('/agent/reports')
def agent_dashboard():
    return render_template('agent/dashboard.html')

@app.route('/agent/manual-review')
def agent_review_queue():
    return redirect('/reviewer/queue')

@app.route('/agent/complaints/new')
def agent_new_complaint():
    return redirect('/agent/dashboard')

@app.route('/agent/complaint/<complaint_id>')
@app.route('/agent/complaint')
def agent_complaint(complaint_id=None):
    complaint_id = complaint_id or request.args.get('id', '')
    return render_template('agent/complaint-detail.html', complaint_id=complaint_id)

@app.route('/reviewer/queue')
@app.route('/admin/manual-review')
def reviewer_queue():
    return render_template('reviewer/queue.html')

@app.route('/reviewer/case/<complaint_id>')
def reviewer_case(complaint_id):
    return render_template('reviewer/case.html', complaint_id=complaint_id)

@app.route('/admin/dashboard')
def admin_dashboard():
    return render_template('admin/dashboard.html')

@app.route('/admin/complaints')
@app.route('/admin/search')
def admin_complaints():
    return render_template('admin/complaints.html')

@app.route('/admin/analytics')
@app.route('/admin/sla')
@app.route('/admin/ai-analysis')
def admin_analytics():
    return render_template('admin/analytics.html')

@app.route('/admin/reports')
def admin_reports():
    return render_template('admin/reports.html')

@app.route('/admin/reports/<report_id>')
def admin_report_detail(report_id):
    return render_template('admin/report-detail.html', report_id=report_id)

@app.route('/admin/complaint/<complaint_id>')
def admin_complaint(complaint_id):
    return render_template('agent/complaint-detail.html', complaint_id=complaint_id)

@app.route('/admin/settings')
def admin_settings():
    return redirect('/admin/dashboard')

if __name__ == '__main__':
    app.run(debug=True, port=5000)
